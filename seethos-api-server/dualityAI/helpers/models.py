import inspect

from django.conf import settings
from django.db import models
from django.db.models.query_utils import DeferredAttribute
from django.utils import timezone

from .utils import day_expiration_period, generate_url_token,generate_code


class UpdateMixin(models.Model):
    class Meta:
        abstract = True

    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)


class CreateAndUpdateMixin(UpdateMixin):
    class Meta:
        abstract = True

    created_by = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.CASCADE,
        default=None,
        null=True
    )


# class Address(models.Model):
#     class Meta:
#         abstract = True

#     address = models.CharField(max_length=250, default=None, null=True, blank=True)
#     city = models.CharField(max_length=250, default=None, null=True, blank=True)
#     state = USStateField(default=None, null=True, blank=True)
#     zip_code = USZipCodeField(default=None, null=True, blank=True)


class TokenModel(models.Model):
    class Meta:
        abstract = True

    account = models.ForeignKey('accounts.Account', on_delete=models.CASCADE)
    token = models.CharField(max_length=256)
    expires_at = models.DateTimeField(default=day_expiration_period)
    used = models.BooleanField(default=False)

    @classmethod
    def create_token(cls, account):
        reset_request = cls.objects.filter(account=account, used=False).first()
        if reset_request:
            reset_request.token = generate_url_token() #generate_code()
            reset_request.expires_at = day_expiration_period()
            reset_request.save()
        else:
            reset_request = cls.objects.create(account=account, token= generate_url_token())
        return reset_request


class Choice(object):
    @classmethod
    def data(cls):
        if not getattr(cls, '_data', False):
            setattr(cls, '_data', [])

            members = inspect.getmembers(cls)
            for name, value in members:
                if not name.startswith('_') and not inspect.ismethod(value):
                    if isinstance(value, tuple) and len(value) > 1:
                        data = value
                    else:
                        pieces = [x.capitalize() for x in name.split('_')]
                        data = (value, ' '.join(pieces))
                    cls._data.append(data)
                    setattr(cls, name, data[0])

            cls._hash = dict(cls._data)
        return cls._data

    @classmethod
    def __len__(cls):
        return len(list(cls.data()))

    @classmethod
    def choices(cls):
        return [(value, data) for value, data in cls.data()]

    @classmethod
    def max_length(cls):
        if not getattr(cls, '_max_length', False):
            max_length = 0
            for d in cls.data():
                max_length = max(len(str(d[0])), max_length)
            cls._max_length = max_length
        return cls._max_length

    @classmethod
    def get_value(cls, key):
        return cls._hash[key]

    @classmethod
    def valid_choice(cls, choice: str) -> bool:
        if choice in cls._hash.keys():
            return True
        return False


# def user_based_path(instance, filename: str) -> str:
#     id = instance.id
#     return f'files/{id}/{filename}'


# def credit_card_based_path(instance, filename: str) -> str:
#     id = instance.id
#     if hasattr(instance, 'created_by'):
#         if instance.created_by == None:
#             return  f'files/cerdit-card/{filename}'     
#     if id is None or type(id) == DeferredAttribute:
#         id = 0       
#     return f'files/credit-card/{id}/{filename}'


