from django.test import TestCase
from django.urls import reverse
from rest_framework import status
from rest_framework.test import APITestCase
from .models import Account
from rest_framework.test import APIClient
from rest_framework.authtoken.models import Token
from django.contrib.auth import get_user_model
from django.conf import settings
from django.utils import timezone
from helpers.viewsets import get_tokens_for_user
from rest_framework import serializers
from helpers.serializers import BaseSerializer
from rest_framework.fields import CurrentUserDefault


# Create your tests here.

#write your  test of accounts viewset here
class AccountTests(APITestCase):
    def setUp(self):
        self.client = APIClient()
        self.user = Account.objects.create_user()
        self.user.save()
        self.token = Token.objects.create(user=self.user)
        self.token.save()
        self.client.credentials(HTTP_AUTHORIZATION='Token ' + self.token.key)
        self.user.is_verified = True
        self.user.is_active = True
        self.user.is_staff = True
        self.user.is_general_active = True
# BEGIN: abpxx6d04wxr
from django.test import TestCase
from django.urls import reverse
from rest_framework import status
from rest_framework.test import APITestCase
from .models import Account
from rest_framework.test import APIClient
from rest_framework.authtoken.models import Token
from django.contrib.auth import get_user_model
from django.conf import settings
from django.utils import timezone
from helpers.viewsets import get_tokens_for_user
from rest_framework import serializers
from helpers.serializers import BaseSerializer
from rest_framework.fields import CurrentUserDefault


# Create your tests here.

#write your  test of accounts viewset here
class AccountTests(APITestCase):
    def setUp(self):
        self.client = APIClient()
        self.user = Account.objects.create_user(username='testuser')
        self.user.save()
        self.token = Token.objects.create(user=self.user)
        self.token.save()
        self.client.credentials(HTTP_AUTHORIZATION='Token ' + self.token.key)
        self.user.is_verified = True
        self.user.is_active = True
        self.user.is_staff = True
        self.user.is_general_active = True

    def test_list_accounts(self):
        url = reverse('account-list')
        response = self.client.get(url)
        self.assertEqual(response.status_code, status.HTTP_200_OK)

    def test_create_account(self):
        url = reverse('account-list')
        data = {
            'username': 'testuser',
            'email': 'testuser@example.com',
            'password': 'testpassword'
        }
        response = self.client.post(url, data, format='json')
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        self.assertEqual(Account.objects.count(), 2)
        self.assertEqual(Account.objects.get(username='testuser').email, 'testuser@example.com')

    def test_retrieve_account(self):
        account = Account.objects.create(username='testuser', email='testuser@example.com', password='testpassword')
        url = reverse('account-detail', args=[account.id])
        response = self.client.get(url)
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.data['username'], 'testuser')
        self.assertEqual(response.data['email'], 'testuser@example.com')

    def test_update_account(self):
        account = Account.objects.create(username='testuser', email='testuser@example.com', password='testpassword')
        url = reverse('account-detail', args=[account.id])
        data = {
            'username': 'newusername',
            'email': 'newemail@example.com',
            'password': 'newpassword'
        }
        response = self.client.put(url, data, format='json')
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(Account.objects.get(id=account.id).username, 'newusername')
        self.assertEqual(Account.objects.get(id=account.id).email, 'newemail@example.com')

    def test_delete_account(self):
        account = Account.objects.create(username='testuser', email='testuser@example.com', password='testpassword')
        url = reverse('account-detail', args=[account.id])
        response = self.client.delete(url)
        self.assertEqual(response.status_code, status.HTTP_204_NO_CONTENT)
        self.assertEqual(Account.objects.count(), 0)
# END: abpxx6d04wxr