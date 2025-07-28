from django.db import models
from django.conf import settings
from django.contrib.auth.models import AbstractBaseUser, PermissionsMixin
from django.contrib.postgres.fields import JSONField
from django.utils import timezone
from django.contrib.postgres.fields import ArrayField
import uuid
from helpers.models import Choice, TokenModel , UpdateMixin
from helpers.sendGrid import send_email,send_verify_email


#model that contains all scrape links
class ScrapeLink(models.Model):
    url = models.CharField(max_length=250, default=None, null=True, blank=True)
    site_map = models.ForeignKey('Sitemap', blank=True, null=True,on_delete=models.CASCADE)
    is_scrape = models.BooleanField(default=False)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)


    def __str__(self):
        return str(self.id)

#sitemap model , it will be used to store sitemap data
class Sitemap(models.Model):
    url = models.CharField(max_length=250, default=None, null=True, blank=True)
    account = models.ForeignKey('accounts.Account', blank=True, null=True,on_delete=models.CASCADE)
    traning_links = ArrayField(models.CharField(max_length=250, default=None, null=True, blank=True),default=list,blank=True,null=True)
    chatbot = models.ForeignKey('Chatbot', blank=True, null=True,on_delete=models.CASCADE)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)


    def __str__(self):
        return str(self.id)


#create file model
class File(models.Model):
    file = models.FileField(upload_to='files/', null=True, blank=True)
    name = models.CharField(max_length=250, default=None, null=True, blank=True)
    type = models.CharField(max_length=250, default=None, null=True, blank=True)
    size = models.CharField(max_length=250, default=None, null=True, blank=True)
    chatbot = models.ForeignKey('Chatbot', blank=True, null=True,on_delete=models.CASCADE)
    account = models.ForeignKey('accounts.Account', blank=True, null=True,on_delete=models.CASCADE)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return str(self.id)

class Chatbot(UpdateMixin):
    #add name ,id (uuid),greeting message,goodbye message(textfield),company name ,status,greeting tags(one to many),suggestive tags,Queswtion(textfield),suggestive tags,avatar,call_to_action_link,call_to_action_prompt
    name = models.CharField(max_length=250, default=None, null=True, blank=True)
    greeting_message = models.TextField(default=None, null=True, blank=True)
    company_name = models.CharField(max_length=250, default=None, null=True, blank=True)
    status = models.BooleanField(default=False)
    greeting_tags = ArrayField(models.CharField(max_length=250, default=None, null=True, blank=True),default=list,blank=True,null=True)
    suggestive_tags = ArrayField(models.CharField(max_length=250, default=None, null=True, blank=True),default=list,blank=True,null=True)
    question = models.TextField(default=None, null=True, blank=True)
    #change avatar to filefield
    avatar = models.FileField(upload_to='avatars/', null=True, blank=True)
    company_logo = models.FileField(upload_to='company_logo/', null=True, blank=True)
    company_description = models.TextField(default=None, null=True, blank=True)
    call_to_action_link = models.CharField(max_length=250, default=None, null=True, blank=True)
    call_to_action_prompt = models.CharField(max_length=250, default=None, null=True, blank=True)
    timezone = models.CharField(max_length=250, default=None, null=True, blank=True)
    conversation_start_flow = models.CharField(max_length=250, default=None, null=True, blank=True)
    conversation_end_flow = models.CharField(max_length=250, default=None, null=True, blank=True)
    bot_id = models.CharField(max_length=250, default=None, null=True, blank=True)
    account = models.ForeignKey('accounts.Account', blank=True, null=True,on_delete=models.CASCADE)
    #file = models.ForeignKey('File', blank=True, null=True,on_delete=models.CASCADE)
    container_id = models.CharField(max_length=250, default=None, null=True, blank=True)
    color = models.CharField(max_length=250, default=None, null=True, blank=True)
    language = models.CharField(max_length=250, default=None, null=True, blank=True)
    sitemap_url = models.CharField(max_length=250, default=None, null=True, blank=True)
    traning_links = ArrayField(models.CharField(max_length=250, default=None, null=True, blank=True),default=list,blank=True,null=True)
    # enum choice field for traning status untrained,training,trained
    traning_status = models.CharField(max_length=10, choices=[('UNTRAINED', 'UNTRAINED'), ('TRAINING', 'TRAINING'), ('TRAINED', 'TRAINED')],default='UNTRAINED', null=True, blank=True)
    theme = models.CharField(max_length=250, default=None, null=True, blank=True)
    website_text = models.TextField(default=None, null=True, blank=True)
    ideal_customer_profile = models.TextField(default=None, null=True, blank=True)

    #add a agentrole field , this is a choice field with values sales, marketing , Customer service
    agent_role = models.CharField(max_length=250, choices=[ ("SALES", "SALES"), ("MARKETING", "MARKETING"), ("CUSTOMER_SERVICE", "CUSTOMER_SERVICE"),
                                                           ('CUSTOMER_SERVICE_ASSISTANT', 'CUSTOMER_SERVICE_ASSISTANT'),
                                                           ('PROFESSIONAL_ASSISTANT', 'PROFESSIONAL_ASSISTANT'),
                                                           ('SALES_ASSISTANT', 'SALES_ASSISTANT'),
                                                           ('MARKETING_ASSISTANT', 'MARKETING_ASSISTANT'),
                                                           ('SHOWROOM_ASSISTANT', 'SHOWROOM_ASSISTANT')
                                                           ], default=None, null=True, blank=True)
    landing_page_headline = models.TextField(max_length=250, default=None, null=True, blank=True)
    landing_page_subheadline = models.TextField(max_length=250, default=None, null=True, blank=True)
    cta_button_label = models.CharField(max_length=250, default=None, null=True, blank=True)
    location = models.CharField(max_length=250, default=None, null=True, blank=True)
    custom_prompt = models.TextField(default=None, null=True, blank=True)
    # is_use_custom_prompt = models.BooleanField(default=False)

    

    def __str__(self):
        return str(self.id)
    
#model for review
class Review(models.Model):
    review = models.TextField(default=None, null=True, blank=True)
    rating = models.IntegerField(default=None, null=True, blank=True)
    name = models.CharField(max_length=250, default=None, null=True, blank=True)
    title = models.CharField(max_length=250, default=None, null=True, blank=True)
    company = models.CharField(max_length=250, default=None, null=True, blank=True)
    image = models.FileField(upload_to='review_images/', null=True, blank=True)
    chatbot = models.ForeignKey('Chatbot', blank=True, null=True,on_delete=models.CASCADE)
    account = models.ForeignKey('accounts.Account', blank=True, null=True,on_delete=models.CASCADE)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)


    def __str__(self):
        return str(self.id)    



#chatbot avatar model
class AvatarImages(models.Model):
    avatar = models.FileField(upload_to='avatars/', null=True, blank=True)
    chatbot = models.ForeignKey('Chatbot', blank=True, null=True,on_delete=models.CASCADE)
    account = models.ForeignKey('accounts.Account', blank=True, null=True,on_delete=models.CASCADE)
    is_active = models.BooleanField(default=False)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)


    def __str__(self):
        return str(self.id)