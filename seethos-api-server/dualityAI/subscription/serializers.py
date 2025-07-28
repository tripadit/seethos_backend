from rest_framework import serializers
from .models import Subscription , BillingAddress
from accounts.models import Account
from accounts.serializers import AccountCommentSerializer
from rest_framework.fields import CurrentUserDefault
import re

class SubscriptionSerializer(serializers.ModelSerializer):
    #stripeToken = serializers.CharField()
    class Meta:
        model = Subscription
        fields = ('id', 'email', 'subscription_type' ,'created_at')

class PauseSubscriptionSerializer(serializers.Serializer):
    date = serializers.DateField()

class changeCardSerializer(serializers.Serializer):
    card_token = serializers.CharField()    
    
class changeCurrentSubSerializer(serializers.Serializer):
    subscription_type = serializers.ChoiceField( choices=[('LOW', 'LOW'), ('MEDIUM', 'MEDIUM'),("INTERMEDIATE",'INTERMEDIATE'), ('ADVANCED', 'ADVANCED')] )
    billing_cycle = serializers.ChoiceField(choices=(("YEARLY","YEARLY"),("MONTHLY","MONTHLY"))) 

#billing address serilizer
class BillingAddressSerializer(serializers.ModelSerializer):
    class Meta:
        model = BillingAddress
        fields = ('id','address','city','state','zip_code','country','phone')    


