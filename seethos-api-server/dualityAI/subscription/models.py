from django.db import models
from tinymce.models import HTMLField
from ckeditor.fields import RichTextField 
from django.utils.text import slugify


class Subscription(models.Model):
    email = models.EmailField()
    subscription_type = models.CharField(max_length=10, choices=[('LOW', 'LOW'), ('MEDIUM', 'MEDIUM'), ('ADVANCED', 'ADVANCED')])
    created_at = models.DateTimeField(auto_now_add=True)
    
    def __str__(self):
        return self.email

#billing address    model
class BillingAddress(models.Model):
    account = models.ForeignKey('accounts.Account', on_delete=models.CASCADE)
    address = models.CharField(max_length=250, default=None, null=True, blank=True)
    city = models.CharField(max_length=250, default=None, null=True, blank=True)
    state = models.CharField(max_length=250, default=None, null=True, blank=True)
    zip_code = models.CharField(max_length=250, default=None, null=True, blank=True)
    country = models.CharField(max_length=250, default=None, null=True, blank=True)
    phone = models.CharField(max_length=250, default=None, null=True, blank=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

class Transaction(models.Model):
    subscriber = models.ForeignKey(Subscription, on_delete=models.CASCADE)
    amount = models.DecimalField(max_digits=6, decimal_places=2)
    description = models.CharField(max_length=255)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)        
