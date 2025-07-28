import celery
from django.core import management
# from notifications.models import MobileDevice
from .models import PasswordReset, VerifyEmail, Account
from django.db.models import F
from django.db.models import Q
from django.utils import timezone
from datetime import timedelta
# from notifications.utils import send_push_multiple_token


#@celery.task(ignore_result=True, default_retry_delay=120, max_retried=60)
def delay_send_password_reset_email(instance_id):
    reset_request = PasswordReset.objects.get(pk=instance_id)
    reset_request.send_password_reset_email()


#@celery.task(ignore_result=True, default_retry_delay=120, max_retried=60)
def delay_send_verify_email_email(instance_id):
    verify_request = VerifyEmail.objects.get(pk=instance_id)
    verify_request.send_verify_email_email()


#@celery.task(ignore_result=True, default_retry_delay=120, max_retried=60)
def flush_expired_tokens():
    management.call_command("flushexpiredtokens", verbosity=0)

