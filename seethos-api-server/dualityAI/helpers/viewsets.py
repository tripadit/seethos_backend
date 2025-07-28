from functools import wraps
from typing import Dict, Optional
from urllib.parse import urlparse, parse_qs
from rest_framework import pagination, status, viewsets
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from rest_framework_simplejwt.authentication import JWTAuthentication
from rest_framework_simplejwt.tokens import RefreshToken
from chatbot.models import Chatbot
from accounts.models import Account
from django.conf import settings
from django.utils import timezone
from rest_framework.viewsets import ModelViewSet


def get_user(request):
    print(request)
    auth_resp = JWTAuthentication().authenticate(request)
    print(auth_resp)
    user = None
    if auth_resp:
        [user, _] = auth_resp
    return user


def authenticated(fn):
    @wraps(fn)
    def wrap(self, request, *args, **kwargs):
        user = get_user(request)
        print(user)
        if user:
            request.user = user
            return fn(self, request, *args, **kwargs)
        return self.respond(error='Unauthorized user', status=status.HTTP_401_UNAUTHORIZED)
    return wrap

#wrapper for subscription
def subscription(fn):
    @wraps(fn)
    def wrap(self, request, *args, **kwargs):
        user = get_user(request)
        if user.is_subscription_active:
            request.user = user
            return fn(self, request, *args, **kwargs)
        return self.respond(error='Unauthorized user', status=status.HTTP_401_UNAUTHORIZED)
    return wrap 

def subscription_limit(num_chatbots):
    def decorator(func):
        @wraps(func)
        def wrapper(self, request, *args, **kwargs):
            user = get_user(request)
            subscription = user.subscription_type

            #check if the user's subscription is active
            if not user.is_subscription_active:
                return Response({'error': 'Your subscription is not active.'}, status=status.HTTP_403_FORBIDDEN)
            #get the number of chatbots of user
            num_chatbots = Chatbot.objects.filter(account=user).count()
            if subscription == Account.SubscriptionType.LOW and num_chatbots >= 2:
                return Response({'error': 'Basic subscription allows only 2 chatbots.'}, status=status.HTTP_403_FORBIDDEN)
            elif subscription == Account.SubscriptionType.INTERMEDIATE and num_chatbots >= 10:
                return Response({'error': 'Pro subscription allows only 10 chatbots.'}, status=status.HTTP_403_FORBIDDEN)
            elif subscription == Account.SubscriptionType.ADVANCED and num_chatbots >= 20:
                return Response({'error': 'Premium subscription allows only 20 chatbots.'}, status=status.HTTP_403_FORBIDDEN)
            elif subscription == "FREE":
                return Response({'error': 'Your subscription is not active.'}, status=status.HTTP_403_FORBIDDEN)    
            return func(self, request, *args, **kwargs)
        return wrapper
    return decorator       

def lenderauthencated(fn):
    @wraps(fn)
    def wrap(self, request, *args, **kwargs):
        user = get_user(request)
        if user.user_type == 'lender':
            request.user = user
            return fn(self, request, *args, **kwargs)
        return self.respond(error='Unauthorized lender', status=status.HTTP_401_UNAUTHORIZED)
    return wrap

def array_status(fn):
    @wraps(fn)
    def wrap(self, request, *args, **kwargs):
        user = get_user(request)
        if not user.array_connect:
            return fn(self, request, *args, **kwargs)
        return self.respond(error='User Already connected to array', status=status.HTTP_401_UNAUTHORIZED)
    return wrap    


def authenticatedGeneral(fn):
    @wraps(fn)
    def wrap(self, request, *args, **kwargs):
        user = get_user(request)
        if user :
            request.user = user
            if user.subscription_type.GENERAL:
                return fn(self, request, *args, **kwargs)
        return self.respond(error='Unauthorized user', status=status.HTTP_401_UNAUTHORIZED)
    return wrap

def authenticatedAdvanced(fn):
    @wraps(fn)
    def wrap(self, request, *args, **kwargs):
        user = get_user(request)
        if user :
            request.user = user
            if user.subscription_type.ADVANCED:
                return fn(self, request, *args, **kwargs)
        return self.respond(error='Unauthorized user', status=status.HTTP_401_UNAUTHORIZED)
    return wrap

def get_tokens_for_user(user):
    refresh = RefreshToken.for_user(user)

    return {
        'refresh': str(refresh),
        'access': str(refresh.access_token),
    }


def parse_page_url(page_url):
    parsed = parse_qs(urlparse(page_url).query)
    if 'page' in parsed.keys():
        return parsed['page'][0]
    return None


class ResultsAsDataPagination(pagination.PageNumberPagination):
    page_size_query_param = 'size'
    page_query_param = 'page'
    max_page_size = 500

    def get_paginated_response(self, data):
        return Response({
            'next': parse_page_url(self.get_next_link()),
            'previous': parse_page_url(self.get_previous_link()),
            'count': self.page.paginator.count,
            'data': data,
        })


class BaseViewSet(viewsets.GenericViewSet):
    authentication_classes = ()
    permission_classes = ()
    pagination_class = ResultsAsDataPagination

    def respond(self, dispatcher=None, raw=None, data: Optional[Dict[str, any]] = None,
                queryset=None, error: Optional[str] = None, status: Optional[int] = status.HTTP_200_OK,
                obj=None, form_error=None):
        DATA_KEY: str = 'data'
        FORM_ERROR_KEY: str = 'form_errors'
        ERROR_KEY: str = 'error'
        response: Dict[str, any] = {}

        if dispatcher:
            # another class dispatched this method.  we need to take its args
            self.args = dispatcher.args
            self.kwargs = dispatcher.kwargs
            self.request = dispatcher.request
            self.format_kwarg = dispatcher.format_kwarg

        if raw:
            response = raw
        if data:
            response[DATA_KEY] = data
        if obj:     # Serialize the object
            response[DATA_KEY] = self.get_serializer().to_representation(obj)
        if queryset is not None:
            page = self.paginate_queryset(queryset)
            if page is not None:
                serializer = self.get_serializer(page, many=True)
                return self.get_paginated_response(serializer.data)
            else:
                serializer = self.get_serializer(queryset, many=True)
        if form_error:
            response[FORM_ERROR_KEY] = form_error.errors
            if not error:
                error = "Errors in your form.  Please fix"
        if error:   # Error message
            response[ERROR_KEY] = error
            if status == 200:
                raise Exception("You threw an error message to the client but your status code was 200 :(")

        return Response(response, status=status)

    def error_response_from_form(self, form, status_code=status.HTTP_412_PRECONDITION_FAILED):
        errors = ', '.join(['%s - %s' % (error, form.errors[error][0])
                            for error in form.errors]).replace('__all__ - ', '')
        return self.respond(error=errors, status=status_code)  # error_meta=form.errors)


from rest_framework.permissions import AllowAny

class BaseAuthViewSet(BaseViewSet):
    authentication_classes = (JWTAuthentication,)
    permission_classes = (IsAuthenticated, )

    def get_permissions(self):
        if self.action == 'generate_asistant_name':
            return [AllowAny()]
        if self.request.method == 'OPTIONS':
            return [AllowAny()]
        return super().get_permissions()

    def get_throttles(self):
        if self.request.method == 'OPTIONS':
            return []
        return super().get_throttles()
