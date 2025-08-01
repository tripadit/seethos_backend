from celery import current_app as current_celery_app

from app.config import settings


def create_celery():
    celery_app = current_celery_app
    celery_app.config_from_object(settings, namespace='CELERY')
    celery_app.conf.broker_login_method = 'AMQPLAIN'

    return celery_app
