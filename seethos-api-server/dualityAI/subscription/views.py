from django.shortcuts import render, redirect
from .forms import SubscriptionForm
from django.core.mail import send_mail
from django.views.decorators.csrf import csrf_exempt # new
from rest_framework.generics import  ListAPIView, RetrieveAPIView, UpdateAPIView, CreateAPIView , ListCreateAPIView
from rest_framework import pagination, status, viewsets
from rest_framework.decorators import action
import stripe
from rest_framework.serializers import (
    BooleanField, CharField, SerializerMethodField, ValidationError,IntegerField,
)
from django_filters.rest_framework import DjangoFilterBackend, NumberFilter, FilterSet, BaseInFilter,MultipleChoiceFilter,CharFilter
from rest_framework import filters as filter
from rest_framework.filters import OrderingFilter
from rest_framework.generics import   ListAPIView, RetrieveAPIView, UpdateAPIView, CreateAPIView ,ListCreateAPIView ,RetrieveUpdateDestroyAPIView
from rest_framework.views import APIView
from rest_framework.response import Response
from django.conf import settings
from .models import Subscription , Transaction , BillingAddress
from rest_framework import viewsets
from accounts.models import Account
from helpers.viewsets import BaseAuthViewSet , BaseViewSet ,authenticated
from .serializers import SubscriptionSerializer, PauseSubscriptionSerializer , changeCardSerializer,changeCurrentSubSerializer ,BillingAddressSerializer
from .utils import get_stripe_session, get_stripe_session_yearly,card_details,change_card ,pause_subscription , delete_subscription , resume_subscription , change_currrent_subscription
from django.db.models import Count
import json
from django.db.models import Q
import datetime
from helpers.sendGrid import send_email
from django.contrib.auth.models import AnonymousUser
from rest_framework import viewsets
from rest_framework.throttling import ScopedRateThrottle
from rest_framework import throttling



stripe.api_key = settings.STRIPE_SECRET_KEY

class SubscriberViewSet(BaseViewSet):

    throttle_scope = 'robots'
    serializer_class = SubscriptionSerializer
    queryset = Subscription.objects.all()
    
    throttle_scope = 'robots'

    def get_serializer_class(self):
        if self.action == "pause_subscribe":
            return PauseSubscriptionSerializer
        if self.action == "change_card_details":
            return changeCardSerializer
        if self.action == "change_subscription_type":
            return changeCurrentSubSerializer
        return self.serializer_class

    @authenticated
    @action(detail=False,throttle_classes=[ScopedRateThrottle], methods=['post'])
    def subscribe(self,request):
        if request.method == 'POST':
            account = request.user
            subscription_type = request.data.get('subscription_type')
            # account.subscription_type=subscription_type
            account.save()
            subscription = get_stripe_session(account,subscription_type) 
            return Response(subscription)        
        return Response('Failed', status = 400)

    @authenticated
    @action(detail=False, throttle_classes=[ScopedRateThrottle],methods=['post'], url_path='upgrade')
    def subscribe_yearly(self,request):
        if request.method == 'POST':
            account = request.user
            subscription_type = request.data.get('subscription_type')
            # account.subscription_type=subscription_type
            account.save()
            subscription = get_stripe_session(account,subscription_type) 
            return Response(subscription)        
        return Response('Failed', status = 400)
    
    @authenticated
    @action(detail=False,throttle_classes=[ScopedRateThrottle], methods=['post'], url_path='upgrade-yearly')
    def subscribe_yearly(self,request):
        if request.method == 'POST':
            account = request.user
            subscription_type = request.data.get('subscription_type')
            account.subscription_type=subscription_type
            account.save()
            subscription = get_stripe_session_yearly(account,subscription_type) 
            return Response(subscription)        
        return Response('Failed', status = 400)

    @authenticated
    @action(detail=False,throttle_classes=[ScopedRateThrottle], methods=['post'], url_path='pause')
    def pause_subscribe(self,request):
        #try:
            date = request.data.get('date')      
            account = request.user
            datetime_obj = datetime.datetime.strptime(date, '%Y-%m-%d')
            timestamp = datetime_obj.timestamp()
            print(account.subscription_id)
            if account.subscription_id:
                subscription = pause_subscription(account.subscription_id,int(timestamp))
                if subscription !=0:
                    account.is_basic_active=False
                    account.is_pro_active = False
                    account.is_premium_active = False
                    account.is_general_active=False
                    account.is_advanced_active = False
                    account.subscription_pause_date = datetime_obj
                    account.is_subscription_pause = True
                    account.save() 
                    return Response(subscription)
                return Response('Failed',status=400)    
        #except:            
            return Response('Failed', status=400)

    @authenticated
    @action(detail=False, methods=['get'], url_path='resume')
    def resume_subscribe(self,request):
        try:        
            account = request.user
            if  account.subscription_id:
                subscription = resume_subscription(account.subscription_id)
                print(subscription)
                if subscription !=0:
                    if account.subscription_type == Account.SubscriptionType.LOW:
                        account.is_basic_active=True
                    elif account.subscription_type == Account.SubscriptionType.INTERMEDIATE:
                        account.is_pro_active = True
                    elif account.subscription_type == Account.SubscriptionType.ADVANCED:
                        account.is_premium_active = True     
                    account.is_subscription_pause = False 
                    account.is_subscription_active = True   
                    account.save() 
                    return Response(subscription)
                return Response('Failed',status=400)
            return Response('Failed', status=400)    
        except:            
            return Response('Failed', status=400)    

    @authenticated
    @action(detail=False,throttle_classes=[ScopedRateThrottle],methods=['delete'], url_path='delete')
    def delete_subscribe(self,request):
        try:        
            account = request.user
            if account.subscription_id:
                subscription = delete_subscription(account.subscription_id)
                if subscription !=0:
                    account.is_basic_active=False
                    account.is_pro_active = False
                    account.is_premium_active = False
                    account.is_subscription_cancel = True
                    account.is_subscription_active = False
                    account.subscription_type = "FREE"
                    account.save() 
                    return Response(subscription)
            return Response('Failed',status=400)    
        except:            
            return Response('Failed', status=400)            

    @authenticated
    @action(detail=False, methods=['get'], url_path='card-details')
    def get_card_details(self,request):
        try:        
            account = request.user
            if account.subscription_id and account.is_subscription_cancel == False:
                subscription = card_details(account.subscription_id)
                if subscription !=0:
                    return Response(subscription)
            return Response('Failed',status=400)    
        except:            
            return Response('Failed', status=400)

    @authenticated
    @action(detail=False,throttle_classes=[ScopedRateThrottle], methods=['post'], url_path='change-card')
    def change_card_details(self,request):
        try:
            card_token = request.data.get('card_token')
            account = request.user
            if account.subscription_id and card_token:
                subscription = change_card(account.subscription_id,card_token)
                if subscription !=0:
                    return Response(subscription)
            return Response('Failed',status=400)    
        except:            
            return Response('Failed', status=400)

    @authenticated
    @action(detail=False,throttle_classes=[ScopedRateThrottle], methods=['post'], url_path='change-current-subscription')
    def change_subscription_type(self,request):
        try:
            subscription_type = request.data.get('subscription_type')
            billing_cycle = request.data.get('billing_cycle')
            account = request.user
            if account.subscription_id :
                subscription = change_currrent_subscription(account,subscription_type,billing_cycle)
                if subscription !=0:
                    return Response(subscription)
            return Response('Failed',status=400)    
        except:            
            return Response('Failed', status=400)  

    #function to get payment history of the user
    # function to get payment history of the user
    @authenticated  
    @action(detail=False, methods=['get'], url_path='payment-history')
    def payment_history(self, request):
        account = request.user
        if account.subscription_id:
            # Retrieve the subscription from Stripe
            subscription = stripe.Subscription.retrieve(account.subscription_id)
            print(subscription)
            # Retrieve the payment history for the subscription from Stripe
            payment_history = stripe.Invoice.list(
                subscription=subscription.id,
                limit=100,
                expand=['data.charge']
            )
            # Return the payment history as a response
            return Response(payment_history)
        else:
            return Response('Failed', status=400)
           
        
    @action(detail=False, methods=['POST'],url_path='webhook')
    def webhook(self,request):
        event = None
        payload = request.data
        sig_header = request.headers['STRIPE_SIGNATURE']

        # try:
        #     event = stripe.Webhook.construct_event(
        #     payload, sig_header, endpoint_secret
        #     )
        # except ValueError as e:
        #     # Invalid payload
        #     raise e
        # except stripe.error.SignatureVerificationError as e:
        #     # Invalid signature
        #     raise e

        # # Handle the event
        # print('Unhandled event type {}'.format(event['type']))
        # print(payload)
        event = payload['type']
        # print("metadata",payload['data']['object'])
        if (event == "checkout.session.completed"):
            sub_id = payload['data']['object']['subscription']
            email = payload['data']['object']['metadata']['email']
            s_type = payload['data']['object']['metadata']['subscription_type']
            #subscription_type = payload['data']['object']['metadata']['subscription_type']
            subscriber = Account.objects.filter(email = email).first()
            name=''
            amount = 0
            payment_date = payload['data']['object']['created']
            next_billing_date = payload['data']['object']['expires_at']
            payment_method = payload['data']['object']['payment_method_types']
            if s_type == Account.SubscriptionType.LOW:
                subscriber.subscription_type = Account.SubscriptionType.LOW
                subscriber.is_basic_active = True
                subscriber.is_subscription_active = True
                name='Basic'
                amount = payload['data']['object']['amount_total']
                list_of_keyfeature = "Provision for up to 2 custom trained chatbots,Support for up to 1,000 pages per chatbot,Allowance of 500 queries per month"

            if s_type == Account.SubscriptionType.ADVANCED:
                subscriber.subscription_type = Account.SubscriptionType.ADVANCED
                subscriber.is_premium_active = True
                subscriber.is_subscription_active = True
                name='Premium'
                amount = payload['data']['object']['amount_total']

                list_of_keyfeature = "Provision for up to 10 custom trained chatbots,Support for up to 5,000 pages per chatbot,Allowance of 1,000 queries per month"

            if s_type == Account.SubscriptionType.INTERMEDIATE:
                subscriber.subscription_type = Account.SubscriptionType.INTERMEDIATE
                subscriber.is_pro_active = True
                subscriber.is_subscription_active = True 
                name='Pro' 
                amount = payload['data']['object']['amount_total'] 

                list_of_keyfeature = "Provision for up to 100 custom trained chatbots,Support for up to 20,000 pages per chatbot,Allowance of 5,000 queries per month"
 
    

            subscriber.subscription_id = sub_id
            subscriber.is_subscription_cancel = False
            subscriber.is_subscription_pause = False
            #send email to the user
            subscriber.is_verified = True        
            subscriber.save()
            subject = "Your Payment Has Been Successfully Processed - Thank You!"
            send_email(to_emails=email,subject=subject,substitutions={
                        "user" : subscriber.full_name,
                        "plan_name":name,
                        "amount":amount/100,
                        "start_date":str(datetime.datetime.fromtimestamp(payment_date)),
                        "end_date":str(datetime.datetime.fromtimestamp(next_billing_date)),
                        "list_of_keyfeature":list_of_keyfeature,
                        "payment_method":payment_method,
                    },template_id='d-6ab1bcc24e32467481318c78cbd15b77')
        # Process the event
        if event == 'customer.subscription.updated':
            subscription = payload['data']['object']
            print(payload)
            #email = payload['data']['object']['metadata']['email']
            try:
                if subscription['pause_collection']:
                    print('Subscription has been paused.')
                    email = payload['data']['object']['metadata']['email']
                    account = Account.objects.filter(email=email).first()
                    text =f"""
                    

                    We want to inform you that your subscription with us has been paused, effective immediately. During this time, you will not be billed and will not have access to the subscription services.\n

                    If this change is incorrect, or if you wish to resume your subscription, please contact our support team.\n

                    We appreciate your understanding and patience. If you have any questions, feel free to contact us.\n

                    Warm regards,
                    Ujjwal Roy
                    CEO
                    Duality AI
                    """
                    send_email(to_emails=email,subject="Your Subscription is Paused!!",substitutions={
                        "subject" : "Your Subscription is Paused!! ",
                        "Email_title" : "Your Subscription is Paused!!",
                        "user" : account.full_name,
                        "text":text ,
                    },template_id='d-8b35b350085d46e18bf85a1a1a2f00f3')
                # Add your own logic here for a paused subscription
                else:
                    print('Subscription has resumed.')
                    email = payload['data']['object']['metadata']['email']
                    account = Account.objects.filter(email=email).first()
                    text = f"""
                    

                    We are pleased to inform you that your subscription with us has been resumed. You will continue to be billed as per our agreement and will regain access to our subscription services immediately.\n

                    If this change is incorrect, or if you have any concerns, please contact our support team.\n

                    Thank you for choosing Duality. If you have any questions, feel free to contact us.\n

                    
                    Warm regards,
                    Ujjwal Roy
                    CEO
                    Duality AI
                    """
                    send_email(to_emails=email,subject="Your Subscription is Resumed!!",substitutions={
                        "subject" : "Your Subscription is Resumed!! ",
                        "Email_title" : "Your Subscription is Resumed!!",                        
                        "user" : account.full_name,
                        "text":text ,
                    },template_id='d-8b35b350085d46e18bf85a1a1a2f00f3')
            except:
                pass        


        return Response({'success': True})            

# need to add viewsets to search news letters  
# 
#      

#billing address viewsets , create , update , delete , list , retrieve
class BillingAddressViewSet(BaseAuthViewSet,CreateAPIView,ListCreateAPIView,RetrieveUpdateDestroyAPIView):
    queryset = BillingAddress.objects.all()
    serializer_class = BillingAddressSerializer

    def get_queryset(self):
        return self.queryset.filter(account=self.request.user)

    def perform_create(self, serializer):
        serializer.save(account=self.request.user)




