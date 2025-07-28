import re

from django.conf import settings
from django.utils import timezone
from helpers.serializers import BaseSerializer
from rest_framework import serializers
from helpers.viewsets import get_tokens_for_user
from rest_framework.serializers import (
    BooleanField, CharField, SerializerMethodField, ValidationError,IntegerField,
)
from rest_framework.fields import CurrentUserDefault
from .models import Account , SenderEmails
from itertools import chain




class AccountSignupRequest(serializers.Serializer):
    email = CharField(required = False)
    password = CharField(required = True , write_only = True)
    subscription_type = CharField(required = True , write_only = True)
    

class AccountMeSerializer(BaseSerializer):
    token = SerializerMethodField()
    is_demo = SerializerMethodField()
    
    class Meta:
        model = Account
        fields = ('id','token' ,'email','full_name','subscription_type','subscription_pause_date','is_verified','is_subscription_pause','is_subscription_cancel','is_subscription_active','is_active','date_joined','updated_at','address','city','country','state','zip_code','phone','timezone','subscription_period','company_name','company_logo','company_sector','company_description','first_time_login','company_size','ideal_customer_profile','is_demo','is_ghl_connected')

    def get_token(self, obj: Account):
        auth_key = get_tokens_for_user(obj)
        return auth_key
    
    def get_is_demo(self, obj: Account):
        #check if email is "rjlaasish@gmail.com"
        if obj.email == "rjlaasish@gmail.com":
            return True
        return False

    def update(self, instance, validated_data):
        full_name = self.validated_data.get('full_name')
        address = self.validated_data.get('address')
        city = self.validated_data.get('city')
        country = self.validated_data.get('country')
        state = self.validated_data.get('state')
        zip_code = self.validated_data.get('zip_code')
        phone = self.validated_data.get('phone')
        timezone = self.validated_data.get('timezone')
        company_name = self.validated_data.get('company_name')
        company_sector = self.validated_data.get('company_sector')
        company_description = self.validated_data.get('company_description')
        first_time_login = self.validated_data.get('first_time_login')
        company_size = self.validated_data.get('company_size')
        ideal_customer_profile = self.validated_data.get('ideal_customer_profile')
    
        instance.full_name = full_name #validated_data.get('subscription_type', instance.subscription_type)  
        instance.address = address
        instance.city = city
        instance.country = country
        instance.state = state
        instance.zip_code = zip_code
        instance.phone = phone
        instance.timezone = timezone
        instance.company_name = company_name
        instance.company_sector =company_sector
        instance.company_description = company_description
        instance.first_time_login = first_time_login
        instance.company_size = company_size
        instance.ideal_customer_profile = ideal_customer_profile



        #get file company_logo
        company_logo = self.validated_data.get('company_logo')
        if company_logo:
            instance.company_logo = company_logo


        instance.save()    
        return instance
        


    



class AccountWriteSerializer(BaseSerializer):
    password = CharField(required=False, write_only=True)
    email = CharField(required=True)
    full_name = CharField(required=True)
    

    class Meta:
        model = Account
        fields = (
            'id', 'password', 'email', 'full_name'
        )
    

    def validate_email(self, value):
        email = value
        if email:
            email = email.strip().lower()
        accounts = Account.objects.filter(email=email)
        
        if self.instance:
            accounts = accounts.exclude(id=self.instance.id)
        if accounts.exists():
            raise ValidationError(("Email address has already been used."))
        return email

    # def validate_password(self, value):
    #     password = value
    #     #check length and special characters
    #     #check length in 
    #     raise ValidationError((Account.objects.PASSWORD_VALIDATION_ERROR))

    

    # def validate_subscription_type(self, value):
    #     type = value
    #     valid = Account.SubscriptionType.valid_choice(type)
    #     if valid:
    #         return type
    #     raise ValidationError(_("Must choice a valid option."))
    


    def create(self, validated_data):
             
        account = Account.objects.create(**validated_data)
        password = self.validated_data.get('password')
        account.set_password(password)
        account.save()
        return account

    def update(self, instance, validated_data):
        full_name = self.validated_data.get('full_name')
        
        instance.full_name = full_name #validated_data.get('subscription_type', instance.subscription_type)          
        instance.save()    
        return instance


class AccountBasicSerializer(BaseSerializer):
   
   
    class Meta:
        model = Account
        fields = ('id', 'email','full_name', 'subscription_type')

class AccountCommentSerializer(BaseSerializer):
   
   
    class Meta:
        model = Account
        fields = ('id', 'email', 'full_name')        
    
class AccountSerializer(BaseSerializer):
    token = SerializerMethodField()
   
   
    class Meta:
        model = Account
        fields = ('id','token' ,'email', 'full_name','subscription_type','first_time_login')

    def get_token(self, obj: Account):
        auth_key = get_tokens_for_user(obj)
        return auth_key    
    
class LetsTalkS(serializers.Serializer):
    name = serializers.CharField() 
    email = serializers.EmailField()
    phone = serializers.CharField()
    Comments = serializers.CharField()  



#serializer for sender emails
    
class SenderEmailsSerializer(serializers.ModelSerializer):
    account = serializers.PrimaryKeyRelatedField(read_only=True)
    class Meta:
        model = SenderEmails
        fields = '__all__'