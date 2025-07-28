from django.test import TestCase

# Create your tests here.
# BEGIN: abpxx6d04wxr
from django.test import TestCase
from rest_framework.test import APIClient
from rest_framework import status
from django.urls import reverse
from chatbot.models import Chatbot

class ChatbotViewSetTestCase(TestCase):
    def setUp(self):
        self.client = APIClient()
        self.chatbot_data = {'name': 'Test Chatbot', 'description': 'This is a test chatbot.'}
        self.response = self.client.post(
            reverse('chatbot-list'),
            self.chatbot_data,
            format='json'
        )

    def test_create_chatbot(self):
        self.assertEqual(self.response.status_code, status.HTTP_201_CREATED)
        self.assertEqual(Chatbot.objects.count(), 1)
        self.assertEqual(Chatbot.objects.get().name, self.chatbot_data['name'])
        self.assertEqual(Chatbot.objects.get().description, self.chatbot_data['description'])

    def test_get_chatbot_list(self):
        response = self.client.get(reverse('chatbot-list'))
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(len(response.data), 1)

    def test_get_chatbot_detail(self):
        chatbot = Chatbot.objects.get()
        response = self.client.get(reverse('chatbot-detail', kwargs={'pk': chatbot.id}))
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.data['name'], chatbot.name)
        self.assertEqual(response.data['description'], chatbot.description)

    def test_update_chatbot(self):
        chatbot = Chatbot.objects.get()
        new_chatbot_data = {'name': 'Updated Chatbot', 'description': 'This is an updated chatbot.'}
        response = self.client.put(
            reverse('chatbot-detail', kwargs={'pk': chatbot.id}),
            new_chatbot_data,
            format='json'
        )
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(Chatbot.objects.get().name, new_chatbot_data['name'])
        self.assertEqual(Chatbot.objects.get().description, new_chatbot_data['description'])

    def test_delete_chatbot(self):
        chatbot = Chatbot.objects.get()
        response = self.client.delete(reverse('chatbot-detail', kwargs={'pk': chatbot.id}))
        self.assertEqual(response.status_code, status.HTTP_204_NO_CONTENT)
        self.assertEqual(Chatbot.objects.count(), 0)

# END: abpxx6d04wxr