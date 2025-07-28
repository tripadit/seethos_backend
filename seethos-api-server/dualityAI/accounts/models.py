from django.db import models
from django.conf import settings
from django.contrib.auth.models import AbstractBaseUser, PermissionsMixin
from django.contrib.postgres.fields import JSONField
from django.utils import timezone
from django.contrib.postgres.fields import ArrayField
import uuid
from helpers.models import Choice, TokenModel
from helpers.sendGrid import send_email,send_verify_email

from .managers import AccountManager


class Account(AbstractBaseUser, PermissionsMixin):
    objects = AccountManager()
    

    # class Meta:
    #     ordering = ('-id',)

    

    class SubscriptionType(Choice):
        LOW = 'LOW'
        MEDIUM = "MEDIUM"
        INTERMEDIATE = 'INTERMEDIATE'
        ADVANCED = 'ADVANCED'
    
    USERNAME_FIELD = settings.ACCOUNT_NATURAL_KEY
    MINIUM_USERNAME_LENGTH = 3
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)

    username = models.CharField('username', max_length=32, unique=True, blank=True, null=True, default=None,)    
    email = models.EmailField('email address', unique=True, default=None, null=True)
    password = models.CharField(('password'), max_length=128, default=None, blank=True)
    subscription_type = models.CharField(
        choices=SubscriptionType.choices(),
        max_length=SubscriptionType.max_length(), default=SubscriptionType.LOW, null=True, blank=True,
    )

    #add field to check if the subscription is monthly or yearly
    subscription_period = models.CharField(max_length=250, default=None, null=True, blank=True)
    subscription_id =  models.CharField( max_length=254, default=None, blank=True, null=True)
    full_name = models.CharField( max_length=254, default=None, blank=True , null=True)
    is_general_active = models.BooleanField(default=False)
    is_advanced_active = models.BooleanField(default=False)
    is_basic_active = models.BooleanField(default=False)
    is_pro_active = models.BooleanField(default=False)
    is_premium_active = models.BooleanField(default=False)
    
    is_subscription_active = models.BooleanField(default=False)
    is_staff = models.BooleanField('staff status', default=False,
                                   help_text=('Designates whether the user can log into this admin site.'))
    is_active = models.BooleanField('active', default=True,
                                    help_text=('Designates whether this user should be treated as '
                                                'active. Unselect this instead of deleting accounts.'))
    is_verified = models.BooleanField('verified', default=False,
                                      help_text=('Designates whether this user has confirmed their email or not.'))

    date_joined = models.DateTimeField(('date joined'), default=timezone.now)
    subscription_pause_date = models.DateTimeField(null=True,default=None,blank=True)
    is_subscription_cancel = models.BooleanField(default=False)
    is_subscription_pause =  models.BooleanField(default=False)
    updated_at = models.DateTimeField(auto_now=True)
    last_login_at = models.DateTimeField(default=None, null=True, blank=True)
    accepted_tos = models.BooleanField(default=False)
    disabled = models.BooleanField(default=False, blank=True)
    #address details
    address = models.CharField(max_length=254, default=None, blank=True, null=True)
    city = models.CharField(max_length=254, default=None, blank=True, null=True)
    state = models.CharField(max_length=254, default=None, blank=True, null=True)
    zip_code = models.CharField(max_length=254, default=None, blank=True, null=True)
    country = models.CharField(max_length=254, default=None, blank=True, null=True)
    phone = models.CharField(max_length=254, default=None, blank=True, null=True)
    timezone = models.CharField(max_length=254, default=None, blank=True, null=True)

    #add company name  , company logo , company sector  , company description
    company_name = models.CharField(max_length=254, default=None, blank=True, null=True)
    company_logo = models.FileField(upload_to='company_logo/', null=True, blank=True)
    company_sector = models.CharField(max_length=254, default=None, blank=True, null=True)
    company_description = models.TextField(default=None, blank=True, null=True)
    company_size = models.CharField(max_length=254, default=None, blank=True, null=True)
    ideal_customer_profile = models.TextField(default=None, null=True, blank=True)

    #boolean to check first time login
    first_time_login = models.BooleanField(default=True, blank=True, null=True)

    seethos_email = models.CharField(max_length=254, default=None, blank=True, null=True)

    sendgrid_api_key = models.CharField(max_length=254, default=None, blank=True, null=True)
    is_ghl_connected = models.BooleanField(default=False)

    def __str__(self) -> str:
        return f'{self.email}'

    

   
    def send_account_locked_email(self):

        send_email('Action Required: Account Locked',
                   settings.DEFAULT_FROM_EMAIL,
                   from_email=settings.SUPPORT_FROM_EMAIL,
                   substitutions={
                       "account_full_name": self.get_full_name(),
                       "date": timezone.now().strftime('%m/%d/%Y'),
                       "time": timezone.now().strftime('%H:%M:%S'),
                       "timezone": timezone.get_current_timezone_name(),
                       "phone": self.phone_international,
                       "email": self.email,
                   }, template_id='')


class PasswordReset(TokenModel):
    def send_password_reset_email(self):
        timestamp = self.expires_at.timestamp()
        reset_link: str = f'{settings.BRANCH_IO_URL}/password-reset?route=reset&token={self.token}&expires_at={timestamp}&email={self.account.email}'
        send_email('Reset Your Password',
                   self.account.email,
                   substitutions={
                       "user": self.account.full_name,
                       "link": reset_link,
                   }, template_id="d-282ba10afdd4430599a0bcc62480a0d2")


class VerifyEmail(TokenModel):
    def send_verify_email_email(self):
        timestamp = self.expires_at.timestamp()
        reset_link: str = f'{settings.BRANCH_IO_URL}/verify/?route=reset&token={self.token}&expires_at={timestamp}&email={self.account.email}'
        print(reset_link)
        code = self.token
        #try:
        send_email('Verify Your Email',
                    self.account.email,
                    substitutions={
                        "user" : self.account.full_name,
                        "link": reset_link,
                    }, template_id="d-15fcee80e21043d9b19bcee1b22509d3")
        #except:
        #    pass
    # def send_verify_email_email(self):
    #     timestamp = self.expires_at.timestamp()
        
    #     code = self.token
    #     if self.account.subscription_type == 'general':
    #             amount = 500
    #             template_id="d-4ea205b1e28a4a0e83c5a4f8250537b1"
    #     elif self.account.subscription_type == 'advanced':
    #             amount = 1000
    #             template_id="d-4ea205b1e28a4a0e83c5a4f8250537b1"
    #     else:
    #             amount = 0
    #             template_id="d-4ea205b1e28a4a0e83c5a4f8250537b1"
    #     if amount == 500:
    #         res = stripe.checkout.Session.create(
    #         success_url="https://example.com/success",
    #                 line_items=[
    #                     {
    #                 "price": "price_1MUSUHE0li5sPcu76qhLP7nb",
                   
    #                 },
    #                 ],
    #                 metadata= {'email':email},
    #                 mode= "subscription",
    #             )
    #         url =  res.url
             

    #     if amount == 1000:
    #         res = stripe.checkout.Session.create(
    #         success_url="https://example.com/success",
    #                 line_items=[
    #                     {
    #                 "price": "price_1MUSUHE0li5sPcu76qhLP7nb",
                    
    #                 },
    #                 ],
    #                 metadata= {'email':email},
    #                 mode= "subscription",
    #             )
    #         url = res.url
              
                    
                
        
    #     #try:
    #     send_email('Verify Your Email',
    #                 self.account.email,
    #                 substitutions={
    #                     "user" : self.account.get_full_name(),
    #                     "code": code,
    #                 }, template_id=template_id)
    #     #except:
    #     #    pass 
        

class SenderEmails(models.Model):
    email = models.EmailField('email address', default=None, null=True)
    is_verified = models.BooleanField('verified', default=False,
                                      help_text=('Designates whether this user has confirmed their email or not.'))
    is_active = models.BooleanField('active', default=True,
                                    help_text=('Designates whether this user should be treated as '
                                                'active. Unselect this instead of deleting accounts.'))
    created_at = models.DateTimeField(('date joined'), default=timezone.now)
    updated_at = models.DateTimeField(auto_now=True)
    is_primary = models.BooleanField(default=False)
    account = models.ForeignKey(Account, on_delete=models.CASCADE, related_name='sender_emails')
    reply_email = models.EmailField(null=True, blank=True)
    def __str__(self) -> str:
        return f'{self.account.email}'

    