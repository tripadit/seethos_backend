from drf_yasg.utils import swagger_auto_schema
from helpers.swagger import ErrorSerializer, swagger_serializer_factory
from rest_framework import serializers

from .models import Account
from .serializers import AccountSerializer, AccountMeSerializer


class AccountDisabledResponse(serializers.Serializer):
    disabled = serializers.BooleanField(default=True)


LoginRequest = swagger_serializer_factory(Account, required=['email', 'password'], request_name='LoginRequest')

login_request = swagger_auto_schema(operation_description="Log in",
                                    methods=['post', 'options'],
                                    responses={
                                        200: AccountMeSerializer(),
                                        202: AccountDisabledResponse(),
                                        401: ErrorSerializer(),
                                    },
                                    request_body=LoginRequest())


class LogoutRequest(serializers.Serializer):
    refresh = serializers.CharField(max_length=200)


logout_request = swagger_auto_schema(operation_description="Log out and expire current JWT token",
                                     responses={200: None},
                                     request_body=LogoutRequest())


# SignupRequest = swagger_serializer_factory(Account, required=[
#     'username', 'email', 'password', 'first_name', 'last_name', 'phone_number'],   
#     request_name='SignupRequest')

class AccountSignupRequest(serializers.Serializer):
    email = serializers.CharField(required = True)
    password = serializers.CharField(required = True, write_only = True)

    full_name = serializers.CharField(required = True)
    
    #subscription_type = serializers.ChoiceField(Account.SubscriptionType.choices())    

signup_request = swagger_auto_schema(operation_description="Sign up for an account",
                                     responses={
                                        200: AccountSerializer(),
                                        412: ErrorSerializer(),
                                     },
                                     request_body=AccountSignupRequest())


MePOSTRequest = swagger_serializer_factory(Account,
                                           request_name='MePOSTRequest')

me_post_request = swagger_auto_schema(operation_description="Request Account information",
                                      method='POST',
                                      responses={
                                        200: AccountSerializer(),
                                        412: ErrorSerializer(),
                                      },
                                      request_body=MePOSTRequest())


PasswordResetGETRequest = swagger_serializer_factory(Account,
                                                     optional=['email'],
                                                     request_name='PasswordResetGETRequest')

password_reset_get_request = swagger_auto_schema(
    operation_description="Submit username to get a token to reset password",
    method='GET',
    query_serializer=PasswordResetGETRequest())


class PasswordResetPOSTRequest(serializers.Serializer):
    token = serializers.CharField(required=True)
    new_password = serializers.CharField(required=True)
    email = serializers.CharField(required = True)


password_reset_post_request = swagger_auto_schema(operation_description="Confirm token and set new password",
                                                  method='POST',
                                                  responses={
                                                    200: AccountSerializer(),
                                                    401: ErrorSerializer(),
                                                    412: ErrorSerializer(),
                                                  },
                                                  request_body=PasswordResetPOSTRequest())


class ChangePasswordRequest(serializers.Serializer):
    old_password = serializers.CharField(required=True)
    new_password = serializers.CharField(required=True)

    class Meta:
        model = Account
        fields = ('old_password', 'new_password', )


change_password_request = swagger_auto_schema(operation_description="Change password while authed",
                                              method='POST',
                                              responses={
                                                200: AccountSerializer(),
                                                412: ErrorSerializer(),
                                              },
                                              request_body=ChangePasswordRequest())

VerifyAccountGETRequest = swagger_serializer_factory(Account,
                                                     optional=['email'],
                                                     request_name='VerifyAccountGETRequest')



verify_account_get_request = swagger_auto_schema(
    operation_description="Submit email  to get verification mail ",
    method='GET',
    responses={
        200: " verification mail is sent to your email  ",
        412: ErrorSerializer(),
                                              },
    query_serializer=VerifyAccountGETRequest())


class VerifyAccountRequest(serializers.Serializer):
    token = serializers.CharField(required=True)
    email = serializers.CharField(required=True)

    class Meta:
        model = Account
        fields = ('token', 'email', )




verify_account_post_request =  swagger_auto_schema(operation_description="Verify account",
                                              method='get',
                                              responses={
                                                200: AccountSerializer(),
                                                412: ErrorSerializer(),
                                              },
                                              query_serializer=VerifyAccountRequest())   



class ChangeEmailRequest(serializers.Serializer):
    old_email = serializers.CharField(required=True)
    new_email = serializers.CharField(required=True)

    class Meta:
        model = Account
        fields = ('old_email', 'new_email', )


change_email_request = swagger_auto_schema(operation_description="Change email while authed",
                                              method='POST',
                                              responses={
                                                200: AccountSerializer(),
                                                412: ErrorSerializer(),
                                              },
                                              request_body=ChangeEmailRequest())
