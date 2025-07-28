import functools
import secrets
import random
from datetime import timedelta
from functools import wraps

from django.utils import timezone


def deserialize(fn):
    @wraps(fn)
    def wrap(self, request, *args, **kwargs):
        if request.body:
            kwargs['data'] = self.request.data
        return fn(self, request, *args, **kwargs)
    return wrap


def day_expiration_period():
    return timezone.now() + timedelta(days=1)


def week_expiration_period():
    return timezone.now() + timedelta(weeks=1)


def month_expiration_period():
    return timezone.now() + timedelta(weeks=4)


def generate_url_token():
    return secrets.token_urlsafe(128)


def add_to_class(cls):
    def deco(fn):
        if isinstance(fn, property):
            setattr(cls, fn.fget.__name__, fn)
        else:
            setattr(cls, fn.__name__, fn)
        return fn
    return deco


def apply_decorators(fn, decorators):
    return functools.reduce(lambda acc, cur: cur(acc), decorators, fn)


def decorate_all_methods(decorator):
    def decorate(cls):
        for attr in cls.__dict__:
            if callable(getattr(cls, attr)):
                setattr(cls, attr, decorator(getattr(cls, attr)))
        return cls
    return decorate


def generate_code():
   return str(random.randint(10000, 99999))
