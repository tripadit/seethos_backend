from __future__ import unicode_literals

import re

from django.conf import settings
from django.contrib.auth.models import BaseUserManager
from django.utils import timezone

NATURAL_KEY = settings.ACCOUNT_NATURAL_KEY


class AccountManager(BaseUserManager):

    def get_by_natural_key(self, val):
        lookup = {NATURAL_KEY: val}
        return self.get(**lookup)

    def create_user(self, username=None, password=None, **extra_fields):
        """
        Creates and saves a User with the given username and password.
        """
        now = timezone.now()
        username = AccountManager.normalize_username(username)
        user = self.model(username=username, is_staff=False, is_active=True, is_superuser=False,
                          last_login=now, date_joined=now, **extra_fields)
        if password:
            user.set_password(password)
        else:
            user.set_unusable_password()
        user.save(using=self._db)
        return user

    def create_superuser(self, email, password=None, **extra_fields):
        user = self.model(
            email=self.normalize_email(email)
        )
        user.set_password(password)
        user.admin = True
        user.is_staff = True
        user.is_active = True
        user.is_superuser = True
        user.is_verified = True
        user.save(using=self._db)
        return user

    def create_invited_user(self, username=None):
        """
        Creates and saves an inactive User with the given username/email and no
        password, to be activated by the sign up accept email.
        """
        now = timezone.now()
        username = (username or '').strip()
        user = self.model(username=username, email=username, is_staff=False, is_active=False,
                          is_superuser=False, last_login=now, date_joined=now)
        user.save(using=self._db)
        return user

    def is_valid_password(self, password):
        if password:
            valid_chars_and_length = re.match(r'[A-Za-z0-9~`!@#$%^&*()+=_-{}\[\]|:;"\'\?\<\>\,\.]{8,}', password)
            at_least_one_num = any(char.isdigit() for char in password)
            at_least_one_special = any(char in '~`!@#$%^&*()+=_-{}[]|:;\"\'?/<>,.' for char in password)
            if valid_chars_and_length and at_least_one_num and at_least_one_special:
                return True
            return False
        return True

    @property
    def PASSWORD_VALIDATION_ERROR(self):
        return """
            Password must be at least 8 characters and contain at least one letter,
            one number, and one special character.
        """
