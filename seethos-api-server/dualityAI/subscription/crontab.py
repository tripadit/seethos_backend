from django_crontab.models import CrontabSchedule, Job
from django.conf import settings
from django.core.management import call_command
from .tasks import send_daily_newsletter

schedule, _ = CrontabSchedule.objects.get_or_create(minute='0', hour='0')
job = Job.objects.get_or_create(
    func=send_daily_newsletter,
    schedule=schedule,
    args='',
    kwargs='',
    defaults={
        'name': 'Send Daily Newsletter',
        'enabled': True,
    }
)[0]