from rest_framework.decorators import action
import stripe
from rest_framework.response import Response
from django.conf import settings
from .serializers import SubscriptionSerializer
from .models import Subscription
from accounts.models import Account
from helpers.sendGrid import send_email
import datetime

stripe.api_key = settings.STRIPE_SECRET_KEY
coupon = settings.STRIPE_COUPON_ID

def get_stripe_session(account,subscription_type):
    account.subscription_period = "MONTHLY"
    if subscription_type == Account.SubscriptionType.LOW:
        account.is_basic_active = True
        account.is_pro_active = False
        account.is_premium_active = False
        #account.save()
        stripe.api_key = settings.STRIPE_SECRET_KEY
        res = stripe.checkout.Session.create(
                    success_url="https://duality.com/dashboard",
                    line_items=[
                        {
                    "price": settings.STRIPE_BASIC_ID_MONTHLY,
                     "quantity":1 ,
                   
                    },
                    ],
                    # invoice_creation={"enabled": True},
                    # discounts=[{'coupon': coupon}],

                    metadata= {'email':account.email, 'subscription_type':Account.SubscriptionType.LOW },
                    mode= "subscription",
                    allow_promotion_codes= True,
                )
        account.subscription_id = res.subscription 
        account.save()         
        return ({'url': res.url})

    if subscription_type == Account.SubscriptionType.ADVANCED:
        account.is_basic_active = False
        account.is_pro_active = False
        account.is_premium_active = True
        #account.save()
        stripe.api_key = settings.STRIPE_SECRET_KEY
        res = stripe.checkout.Session.create(
                    success_url="https://duality.seethos.com/dashboard",
                    line_items=[
                        {
                    "price": settings.STRIPE_PREMIUM_ID_MONTHLY ,
                    "quantity":1
                   
                    },
                    ],
                    metadata= {'email':account.email,'subscription_type':Account.SubscriptionType.ADVANCED},
                    mode= "subscription",
                    # invoice_creation={"enabled": True},
                    # discounts=[{'coupon': coupon}],
                    allow_promotion_codes= True,
                )
        print(res.subscription,res)
        account.subscription_id = res.subscription 
        account.save()       
        return ({'url': res.url})

    if subscription_type == Account.SubscriptionType.INTERMEDIATE:
        account.is_basic_active = False
        account.is_pro_active = True
        account.is_premium_active = False
        #accounts.is_subscription_active = False
        #account.save()
        stripe.api_key = settings.STRIPE_SECRET_KEY
        res = stripe.checkout.Session.create(
                    success_url="https://duality.seethos.com/dashboard",
                    line_items=[
                        {
                    "price": settings.STRIPE_PRO_ID_MONTHLY ,
                    "quantity":1
                   
                    },
                    ],
                    metadata= {'email':account.email,'subscription_type':Account.SubscriptionType.INTERMEDIATE},
                    mode= "subscription",
                    # invoice_creation={"enabled": True},
                    # discounts=[{'coupon': coupon}],
                    allow_promotion_codes= True,
                )
        print(res.subscription,res)
        account.subscription_id = res.subscription 
        account.save()       
        return ({'url': res.url})    
    
def get_stripe_session_yearly(account,subscription_type):
    account.subscription_period = "YEARLY"
    if subscription_type == Account.SubscriptionType.LOW:
        account.is_basic_active = True
        account.is_pro_active = False
        account.is_premium_active = False
        #account.save()
        stripe.api_key = settings.STRIPE_SECRET_KEY
        res = stripe.checkout.Session.create(
                    success_url="https://duality.seethos.com/dashboard",
                    line_items=[
                        {
                    "price": settings.STRIPE_BASIC_ID_YEARLY,
                     "quantity":1 #"price_1MUSUHE0li5sPcu76qhLP7nb",
                   
                    },
                    ],
                    metadata= {'email':account.email, 'subscription_type':Account.SubscriptionType.LOW },
                    mode= "subscription",
                    # invoice_creation={"enabled": True},
                    # discounts=[{'coupon' : coupon}],
                    allow_promotion_codes= True,
                )
        account.subscription_id = res.subscription 
        account.save()         
        return ({'url': res.url})

    if subscription_type == Account.SubscriptionType.ADVANCED:
        account.is_basic_active = False
        account.is_pro_active = False
        account.is_premium_active = True
        #account.save()
        stripe.api_key = settings.STRIPE_SECRET_KEY
        res = stripe.checkout.Session.create(
                    success_url="https://duality.seethos.com/dashboard",
                    line_items=[
                        {
                    "price": settings.STRIPE_PREMIUM_ID_YEARLY ,
                    "quantity":1
                   
                    },
                    ],
                    metadata= {'email':account.email,'subscription_type':Account.SubscriptionType.ADVANCED},
                    mode= "subscription",
                    # invoice_creation={"enabled": True},
                    # discounts=[{'coupon': coupon}],
                    allow_promotion_codes= True,
                )
        
        account.subscription_id = res.subscription 
        account.save()       
        return ({'url': res.url})
    if subscription_type == Account.SubscriptionType.INTERMEDIATE:

        account.is_basic_active = False
        account.is_pro_active = True
        account.is_premium_active = False        
        #accounts.is_subscription_active = False
        #account.save()
        stripe.api_key = settings.STRIPE_SECRET_KEY
        res = stripe.checkout.Session.create(
                    success_url="https://duality.seethos.com/dashboard",
                    line_items=[
                        {
                    "price": settings.STRIPE_PRO_ID_YEARLY ,
                    "quantity":1
                   
                    },
                    ],
                    metadata= {'email':account.email,'subscription_type':Account.SubscriptionType.INTERMEDIATE},
                    mode= "subscription",
                    # invoice_creation={"enabled": True},
                    # discounts=[{'coupon': coupon}],
                    allow_promotion_codes= True,
                )
        print(res.subscription,res)
        account.subscription_id = res.subscription 
        account.save()       
        return ({'url': res.url})        

def pause_subscription(id,resume_date):
    #try:
        account = Account.objects.filter(subscription_id = id).first()
       
        subscription = stripe.Subscription.modify(
        id,
        pause_collection={
            'behavior': 'void',
            'resumes_at': int(resume_date),
        },
        metadata= {'email':account.email,'event':'pause' }
        )
        
        account = Account.objects.filter(subscription_id=id).first()
        deactivated_date = datetime.datetime.fromtimestamp(resume_date)
        
        send_email(to_emails=account.email,subject="Your Subscription is Paused!!",substitutions={
                        "user" : account.full_name,
                        "deactivate_date":str(deactivated_date) ,
                        "website_link":"https://duality.seethos.com/dashboard",
                        "link":"https://duality.seethos.com/dashboard",
                    },template_id='d-54ad48ad1e664583b6bea91cd8e1163e')
        return "sucess"
    #except:
    #    return 0

def delete_subscription(id):
    try:
        # Get the subscription you want to pause or cancel
        subscription = stripe.Subscription.retrieve(id)

        # Pause the subscription
        subscription.delete()
        account = Account.objects.filter(subscription_id=id).first()
        subject = "Your Subscription Has Been Cancelled"

        message = f"""
        

        We are reaching out to inform you that your subscription with seethos.ai has been cancelled.\n

        As of now, you will no longer have access to the services and benefits associated with your subscription. \n

        If this cancellation was not intended, or if you want to reactivate your subscription at any time, please visit your account page on our website or contact our customer support.

        We regret to see you go and would appreciate any feedback regarding your experience with our service. It will help us improve our offerings.

        Thank you for your time with us.\n

        """
        send_email(to_emails=account.email,subject=subject,substitutions={
                        "user" : account.full_name,
                        "text":message ,
                    },template_id='d-dc170584b99b45e7979eaa5077e1f156')

        return "sucess"
    except:
        return "Failed"
def resume_subscription(id):
    try:
        #Get the subscription_id you want to resume 
        account = Account.objects.filter(subscription_id = id).first()
        subscription = stripe.Subscription.modify(
        id,
        pause_collection='',
        metadata= {'email':account.email }
        )
        account = Account.objects.filter(subscription_id=id).first()
        subject = "Your Subscription Has Been Resumed"
        message = f""" 

        We are reaching out to inform you that your subscription with Duality has been resumed.\n

        As of now, you will have access to the services and benefits associated with your subscription. \n

        If this resumption was not intended, or if you want to cancel your subscription at any time, please visit your account page on our website or contact our customer support.

        We regret to see you go and would appreciate any feedback regarding your experience with our service. It will help us improve our offerings.

        Thank you for your time with us.\n


        """

        

        return "sucess"
    except:
        return 0  

def card_details(id):
    try:
        #Get the subscription you want to pause or cancel
        subscription = stripe.Subscription.retrieve(id)

        default_payment_method_id = subscription.default_payment_method
        
        # Retrieve the payment method object
        payment_method = stripe.PaymentMethod.retrieve(default_payment_method_id)
        
        # Retrieve specific card details
        card_brand = payment_method.card.brand
        card_last4 = payment_method.card.last4
        expiration_month = payment_method.card.exp_month
        expiration_year = payment_method.card.exp_year
        
        return {"card_brand":card_brand,"card_last4":card_last4,"expiration_month":expiration_month,"expiration_year":expiration_year}
    except:
        return 0 

def change_card(id,token):
    try:
        #Get the subscription you want to pause or cancel
        subscription = stripe.Subscription.retrieve(id)
      
        card_token = token# Replace with the token of the new card
        payment_method = stripe.PaymentMethod.create(
            type='card',
            card={
            'token': card_token
         }
        )
       
        #subscription = stripe.Subscription.retrieve(subscription_id)
        customer_id = subscription.customer
        stripe.PaymentMethod.attach(
            payment_method.id,
        customer=customer_id
        )
        # subscription.default_payment_method = payment_method.id
        # subscription.save()
        # # Retrieve specific card details
        # default_payment_method_id = subscription.default_payment_method
        stripe.Subscription.modify(
            id,
        default_payment_method=payment_method.id
        )
        
        # Retrieve the payment method object
        payment_method = stripe.PaymentMethod.retrieve(payment_method.id)
        
        # Retrieve specific card details
        card_brand = payment_method.card.brand
        card_last4 = payment_method.card.last4
        expiration_month = payment_method.card.exp_month
        expiration_year = payment_method.card.exp_year
        account = Account.objects.filter(subscription_id=id).first()
        subject = "Your Payment Method Has Been Updated"
        message = f"""
            

            We are reaching out to inform you that the payment method associated with your account at duslity has been updated.\n

            To see the current payment method and manage it if needed, please visit your account page on our website.\n

            If you did not make this change or if you believe this is an error, please contact our customer support immediately.\n

            Thank you for your attention to this matter. \n
        """
        send_email(to_emails=account.email,subject=subject,substitutions={

                        "Email_title" : "Your Payment Method Has Been Updated",
                        "user" : account.full_name,
                        "text":message ,
                    },template_id='d-8b35b350085d46e18bf85a1a1a2f00f3')

        return {"card_brand":card_brand,"card_last4":card_last4,"expiration_month":expiration_month,"expiration_year":expiration_year}

    except:
        return 0   

def change_currrent_subscription(account,types,cycle):
    account.subscription_type = types
    account.save()
    if account.subscription_type == Account.SubscriptionType.LOW:
        account.is_basic_active = True
        account.is_pro_active = False
        account.is_premium_active = False
        if cycle == "YEARLY":
            account.subscription_period = "YEARLY"
            new_price_id = settings.STRIPE_BASIC_ID_YEARLY
        else:
            account.subscription_period = "MONTHLY"
            new_price_id = settings.STRIPE_BASIC_ID_MONTHLY

    if account.subscription_type == Account.SubscriptionType.INTERMEDIATE:
        account.is_basic_active = False
        account.is_pro_active = True
        account.is_premium_active = False
        if cycle == "YEARLY":
            account.subscription_period = "YEARLY"
            new_price_id = settings.STRIPE_PRO_ID_YEARLY
        else:
            account.subscription_period = "MONTHLY"
            new_price_id = settings.STRIPE_PRO_ID_MONTHLY      


    if account.subscription_type == Account.SubscriptionType.ADVANCED:
        account.is_basic_active = False
        account.is_pro_active = False
        account.is_premium_active = True
        if cycle == "YEARLY":
            account.subscription_period = "YEARLY"
            new_price_id = settings.STRIPE_PREMIUM_ID_YEARLY
        else:
            account.subscription_period = "MONTHLY"
            new_price_id = settings.STRIPE_PREMIUM_ID_MONTHLY

    try:
        #Get the subscription you want to pause or cancel
        subscription = stripe.Subscription.retrieve(account.subscription_id)
        stripe.Subscription.modify(
            subscription.id,
            cancel_at_period_end=False,

            proration_behavior='create_prorations',
            items=[{
                'id': subscription['items']['data'][0].id,
                'price': new_price_id,
            }]

            )
        account.save()

        subject = "Your Subscription Has Been Updated"

        if account.subscription_type == Account.SubscriptionType.LOW:
            plan_name = "Essential Package"
        if account.subscription_type == Account.SubscriptionType.INTERMEDIATE:
            plan_name = "Professional Package"
        if account.subscription_type == Account.SubscriptionType.ADVANCED:
            plan_name = "Platinum Package"

        subscription_end_date = get_next_billing_date(account)     
       
        message = f"""

        We are reaching out to inform you that your subscription with Duality has been updated.\n

        As of now, you will have access to the services and benefits associated with your subscription. \n

        your new plan is {plan_name} and your next billing date is {subscription_end_date} \n

        If this resumption was not intended, or if you want to cancel your subscription at any time, please visit your account page on our website or contact our customer support.

        We regret to see you go and would appreciate any feedback regarding your experience with our service. It will help us improve our offerings.

        Thank you for your time with us.\n

        """


        send_email(to_emails=account.email,subject=subject,substitutions={
                        "subject" : "Your Subscription Has Been Updated",
                        "Email_title" : "Your Subscription Has Been Updated",
                        "user" : account.full_name,
                        "text":message ,
                    },template_id='d-8b35b350085d46e18bf85a1a1a2f00f3')
        
        return "sucess"
        
    except:
        return 0    

def get_next_billing_date(account):
    try:
        id = account.subscription_id
        #Get the subscription you want to pause or cancel
        subscription = stripe.Subscription.retrieve(id)
        next_billing_date = subscription.current_period_end
        #change to datetime
        next_billing_date = datetime.datetime.fromtimestamp(next_billing_date)
        return next_billing_date
    except:
       return 0                  

