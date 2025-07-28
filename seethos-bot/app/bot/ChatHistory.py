from pymongo import MongoClient

from app.config import settings

client = MongoClient(settings.MONGODB_URI)
db = client["Bots"]


class ChatHistory:

    def __init__(self, subdomain):
        self.query_count = 0
        self.conversations = db[subdomain]

        # get query count
        self.get_query_count_by_chatbot(subdomain)

    def inc_query_count(self):
        self.query_count = self.query_count + 1

    def get_query_count_by_chatbot(self, subdomain):
        import requests
        try:
            url = f'https://api.admin.seethoschatbot.com/api/v1/bot_info/get_query_count_by_chatbot/?chatbot_id={subdomain}'
            response = requests.get(url)
            # check if response is 200
            if response.status_code == 200:
                self.query_count = response.json()['query_count']
        except:
            pass

        try:
            self.query_count = self.conversations.find().sort("_id", -1).limit(1)[0]['query_counter']
        except:
            self.query_count = 0
