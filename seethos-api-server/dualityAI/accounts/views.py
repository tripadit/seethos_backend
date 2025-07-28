from django.shortcuts import render

# Create your views here.
from django.db.models import Q, Count, Case, When
from django.db.models.expressions import RawSQL
from django.utils import timezone
from django.shortcuts import redirect
from django.http import HttpResponsePermanentRedirect
from helpers.utils import deserialize
from helpers.viewsets import BaseViewSet, authenticated , lenderauthencated
from rest_framework import status
from rest_framework.response import Response
from rest_framework.decorators import action
from rest_framework_simplejwt.tokens import RefreshToken
from rest_framework import renderers
from django_filters.rest_framework import DjangoFilterBackend, NumberFilter, FilterSet, BaseInFilter,MultipleChoiceFilter,CharFilter
from rest_framework import filters as filter
from rest_framework.generics import ListAPIView, RetrieveAPIView, UpdateAPIView, CreateAPIView , ListCreateAPIView , RetrieveUpdateDestroyAPIView
from rest_framework.throttling import ScopedRateThrottle
from helpers.viewsets import BaseAuthViewSet, ResultsAsDataPagination , get_tokens_for_user
from subscription.utils import get_stripe_session
import operator
import random
from helpers.sendGrid import send_lets_talk , get_stats_by_sender_email
import datetime
from dateutil.relativedelta import relativedelta




from .models import Account, PasswordReset, VerifyEmail , SenderEmails
from .serializers import AccountSerializer, AccountWriteSerializer, AccountBasicSerializer, AccountMeSerializer  , AccountSignupRequest , LetsTalkS , AccountMeSerializer
from .swagger import (
    change_password_request, login_request, logout_request, me_post_request,
    password_reset_get_request, password_reset_post_request, signup_request,
    verify_account_get_request, verify_account_post_request , change_email_request
)
from .tasks import (
    delay_send_password_reset_email, delay_send_verify_email_email
)



class AccountViewSet(BaseViewSet):
    """
        Endpoints:\n
            POST        -   /accounts/login/
            POST        -   /accounts/signup/
            GET, POST, DELETE    -   /accounts/me/
            GET, POST    -   /accounts/reset-password/
    """
    throttle_scope = 'robots'
    serializer_class = AccountBasicSerializer
    queryset = Account.objects.filter(is_active=True)

    def get_serializer_class(self):
        if self.action == 'login'  or self.action =='VerifyEmail':
            return AccountSerializer
        # if self.action == 'signup':
        #     return AccountSignupRequest    
        if self.action == 'me':
            return AccountMeSerializer 
        if self.action == "lets_talk":
            return LetsTalkS    
        return self.serializer_class

    @deserialize
    @login_request
    @action(detail=False, methods=['post', 'options'])
    def login(self, request, data={}):
        if request.method == 'OPTIONS':
            response = Response(status=status.HTTP_200_OK)
            response['Access-Control-Allow-Origin'] = 'http://localhost:3000'
            response['Access-Control-Allow-Methods'] = 'POST, OPTIONS'
            response['Access-Control-Allow-Headers'] = 'Content-Type, Authorization'
            response['Access-Control-Allow-Credentials'] = 'true'
            return response

        email = data.get('email', '').strip().lower()
        password = data.get('password', '').strip()
        # #print(email)
        account = Account.objects.filter(Q(email=email) | Q(username=email)).first()
        if account:
            if account.check_password(password):
                if account.disabled or not account.is_verified:
                    reason = 'disabled' if account.disabled else 'unverified'
                    return self.respond(error={'code': reason}, status=status.HTTP_403_FORBIDDEN)
                else:
                    return self.respond(obj=account)
        return self.respond(error="Username/email or password not recognized",
                            status=status.HTTP_401_UNAUTHORIZED)

    @deserialize
    @logout_request
    @authenticated
    @action(detail=False, methods=['post'])
    def logout(self, request, data={}):
        token = RefreshToken(data['refresh'])
        token.blacklist()
        return self.respond(status=status.HTTP_200_OK)

    @deserialize
    @signup_request
    @action(detail=False, methods=['post'])
    def signup(self, request, data={}):
        account = None
        data_copy = data.copy()
        serializer = AccountWriteSerializer(data=data_copy, context={'request': request})
        if serializer.is_valid():
            account = serializer.save()
            reset_request = VerifyEmail.create_token(account)
            #delay_send_verify_email_email(reset_request.id)
            auth_key = get_tokens_for_user(account)
            return self.respond(status=status.HTTP_200_OK, raw={'email': data['email'],'token':auth_key})
        return self.error_response_from_form(serializer)

    @deserialize
    #@me_post_request
    @authenticated
    @action(detail=False, methods=['get','post'])
    def me(self, request, data={}, *args, **kwargs):
        account = request.user
        if request.method == 'GET':

            return self.respond(obj=account)
        elif request.method == 'POST':
            serializer = AccountMeSerializer(data=data, instance=account, context={'request': request})
            if serializer.is_valid():
                account = serializer.update(account, serializer.validated_data)
                return self.respond(obj=account)
            # #print(serializer.errors)
            return self.error_response_from_form(serializer)

            

    @deserialize
    @verify_account_get_request
    @action(detail=False, methods=['get'],throttle_classes=[ScopedRateThrottle] ,url_path='verify-email')
    def verify_email(self, request, data={}):
        if request.method == 'GET':
            email = self.request.GET.get('email', '').strip().lower()
            account = Account.objects.filter(Q(email=email) | Q(username=email)).first()
            print(account)
            if account and account.disabled is False and account.is_verified is False:
                verify_request = VerifyEmail.create_token(account)
                delay_send_verify_email_email(verify_request.id)
                return self.respond(status=status.HTTP_200_OK)
            return self.respond(status=404)    

    #@deserialize
    @verify_account_post_request
    @action(detail=False, methods=['get'], url_path='verify')
    def VerifyEmail(self, request):
        token = self.request.GET.get('token', '').strip()
        print(token)
        email = self.request.GET.get('email', '').strip()
        if token:

            verify_request = VerifyEmail.objects.filter(token=token, account__email=email).first()
            if verify_request and verify_request.expires_at > timezone.now():
                account = verify_request.account
                #check if account is verified , if verified return already verified
                if account.is_verified:
                    return self.respond(status=status.HTTP_200_OK, data={'data': "Already verified"})
                if account.is_verified or account.email != email:
                    return self.respond(status=status.HTTP_412_PRECONDITION_FAILED, data={'data': "Invallied code"})
                elif not verify_request.used:
                    account.is_verified = True
                    #account.subscription_type = Account.SubscriptionType.FREE
                    account.save()
                    verify_request.used = True
                    verify_request.save()
                    # if account.subscription_type == Account.SubscriptionType.ADVANCED:
                    #     subscription = get_stripe_session(account)
                    #     print(subscription)
                    #     return self.respond(status=status.HTTP_200_OK, data=subscription)
                    # if account.subscription_type == Account.SubscriptionType.GENERAL:
                    #     subscription = get_stripe_session(account)
                    #     return self.respond(status=status.HTTP_200_OK, data=subscription)
                    return self.respond(status=status.HTTP_200_OK, obj=account)        
            else:
                return  self.respond(status=status.HTTP_401_UNAUTHORIZED, data={"code expired"})      

        return self.respond(status=status.HTTP_401_UNAUTHORIZED, data={"Invallied code"})

    @deserialize
    @password_reset_get_request
    @password_reset_post_request
    @action(detail=False, methods=['get', 'post'],throttle_classes=[ScopedRateThrottle] ,url_path='reset-password')
    def request_password_reset(self, request, data={}):
        if request.method == 'GET':
            email = self.request.GET.get('email', '').strip().lower()
            account = Account.objects.filter(Q(email=email) | Q(username=email)).first()
            print(account)
            if account and account.disabled is False:
                reset_request = PasswordReset.create_token(account)
                delay_send_password_reset_email(reset_request.id)
        elif request.method == 'POST':
            token = data.get('token', '').strip()
            email = data.get('email', '').strip()
            new_password = data.get('new_password', '').strip()
            if new_password:
                reset_request = PasswordReset.objects.filter(token=token, used=False).first()
                try:
                    if reset_request.account.email != email:
                        return self.respond(error="Invalid token", status=status.HTTP_401_UNAUTHORIZED)
                    if reset_request and reset_request.expires_at > timezone.now():
                        account = reset_request.account
                        account.set_password(new_password)
                        #check if account is verified , if not verified then verify
                        if account.is_verified is False:
                            account.is_verified = True
                        account.save()
                        reset_request.used = True
                        reset_request.save()
                        return self.respond(status=status.HTTP_200_OK, obj=account)
                except:
                    pass        
                return self.respond(error="Invalid token", status=status.HTTP_401_UNAUTHORIZED)
            return self.respond(error="New password must be supplied", status=status.HTTP_412_PRECONDITION_FAILED)
        return self.respond(status=status.HTTP_200_OK)

    @deserialize
    @change_password_request
    @authenticated
    @action(detail=False, methods=['post'], url_path='change-password')
    def change_password(self, request, data={}, *args, **kwargs):
        account = request.user
        old_password = data.get('old_password', '').strip()
        new_password = data.get('new_password', '').strip()
        if new_password and account.check_password(old_password):
            if Account.objects.is_valid_password(new_password):
                account.set_password(new_password)
                account.save()
                return self.respond(status=status.HTTP_200_OK, obj=account)
            return self.respond(error=Account.objects.PASSWORD_VALIDATION_ERROR,
                                status=status.HTTP_412_PRECONDITION_FAILED)
        return self.respond(error="Old password was incorrect", status=status.HTTP_412_PRECONDITION_FAILED)
   
    @deserialize
    @change_email_request
    @authenticated
    @action(detail=False, methods=['post'], url_path='change-email')
    def change_email(self, request, data={}, *args, **kwargs):
        account = request.user
        old_email = data.get('old_email', '').strip()
        new_email = data.get('new_email', '').strip()
        if new_email and account.email == old_email:
                try:
                    account.email = new_email
                    account.save()
                
                    return self.respond(status=status.HTTP_200_OK, obj=account)
                except:            
                    return self.respond(error="Failed to change email",
                                status=status.HTTP_412_PRECONDITION_FAILED)
        return self.respond(error="Old email was incorrect", status=status.HTTP_412_PRECONDITION_FAILED)
   
    #@authenticated
    @action(detail=False, methods=['post'])
    def lets_talk(self, request, pk=None):
        name = request.data.get('name','')
        email = request.data.get('email','')
        phone = request.data.get('phone','')
        comments = request.data.get('Comments','')

        #try:
        res = send_lets_talk(name,email,phone,comments)
        return Response({'message':'sucess'})
        #except:
        #    return Response({'message':'failed'})  

    #@deserialize
    @authenticated
    @action(detail=False, methods=['post'], url_path='email-stats')
    def get_email_stats(self, request, pk=None):
        user = request.user
        sender_email = SenderEmails.objects.filter(account = user).all()
        print(sender_email)
        if not sender_email:
            return Response({'message':'No sender email found'})
        emails = [account.email for account in sender_email]
        start_date = request.data.get('start_date','')
        if not start_date:
            six_months_ago = datetime.datetime.now() - relativedelta(months=6)
            start_date = six_months_ago.strftime('%Y-%m-%d')
        end_date = request.data.get('end_date', '')
        if not end_date:
            end_date = datetime.datetime.now().strftime('%Y-%m-%d')
        filter_by = request.data.get('filter_by','year')
        #try:
        if emails == None:
            return Response({'message':'failed'})
        api_key = user.sendgrid_api_key
        if not api_key:
            return Response({'message':'No api key found'})
        res = get_stats_by_sender_email(emails,start_date,end_date,filter_by,api_key)
        return Response({'message':'sucess','data':res})
        #except:
        #    return Response({'message':'failed'})

##sender email viewset
     