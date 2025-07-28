import requests

from app.bot.AgentConfigData import AgentConfigData
from app.bot.ChatHistory import ChatHistory
from app.bot.Tools import Tools
from app.chat.chat_manager import ConnectionManager
from app.config import settings


class seethoschatbotBot:

    def __init__(self, subdomain: str, session: str):
        self.vector_db = None
        self.id = subdomain
        self.session = session
        self.name = None
        self.company_name = None
        self.assistant_role = None
        self.questions = None
        self.call_to_action_prompt = None
        self.greeting_message = None
        self.file_url = None
        self.system_prompt = None
        self.config_url = f"https://s3.{settings.AWS_REGION}.amazonaws.com/{settings.AWS_BUCKET_NAME}/{subdomain}/{subdomain}_config.json"

        self.chat_manager = ConnectionManager()

        # get information about yourself from s3 bucket
        self.learn_yourself()
        self.chat_history = ChatHistory(self.id)

        self.agent = self.process_llm_agent()

    def learn_yourself(self):
        import logging
        import json
        logging.basicConfig(level=logging.INFO)
        
        # Try to load from local file first
        try:
            with open("app/bot/bot_config.json", "r") as f:
                bot_config = json.load(f)
            logging.info("Loaded bot configuration from local file: app/bot/bot_config.json")
            for key, value in bot_config.items():
                if hasattr(self, key):
                    setattr(self, key, value)
        except FileNotFoundError:
            logging.warning("Local bot_config.json not found. Attempting to fetch from S3.")
            try:
                response = requests.get(self.config_url)
                logging.info(f"Config response status code: {response.status_code}")
                response.raise_for_status()
                bot_config = response.json()

                for key, value in bot_config.items():
                    if hasattr(self, key):
                        setattr(self, key, value)
            except requests.exceptions.RequestException as e:
                logging.warning(f"Could not fetch bot configuration from {self.config_url}. Using default values. Error: {e}")
                self.name = "Default Bot"
                self.company_name = "Default Company"
                self.assistant_role = "a helpful assistant"
                self.questions = []
                self.call_to_action_prompt = "How can I help you today?"
                self.greeting_message = "Hello! How can I assist you?"
                self.file_url = None
                self.system_prompt = "You are a helpful assistant."

        # once config is fetched, fetch vector database
        if self.file_url:
            logging.info(f"Fetching vector DB from: {self.file_url}")
            try:
                response = requests.get(self.file_url)
                logging.info(f"Vector DB response status code: {response.status_code}")
                response.raise_for_status()
                self.vector_db = response.content
            except requests.exceptions.RequestException as e:
                logging.warning(f"Could not fetch vector DB from {self.file_url}. Proceeding without it. Error: {e}")
                self.vector_db = None
        else:
            logging.info("No file_url specified for vector DB. Skipping fetch.")

        # This line was causing an error if file_url was None or fetch failed.
        # It should only be set if a vector_db was successfully fetched.
        # self.vector_db = response.content

    def process_llm_agent(self) -> AgentConfigData:
        agent = AgentConfigData()

        # generate tools for this agent instance
        tools = self.tools_generator()

        # generate agent with the tools
        agent.generate_message(self.name, self.company_name,self.assistant_role, self.questions,self.system_prompt)
        agent.add_agent(tools)

        return agent

    def tools_generator(self):
        tools = Tools()

        # tools.add_meet_tool(
        #     subdomain=self.id,
        #     session_id=self.session,
        #     call_to_action_prompt=self.call_to_action_prompt
        # )

        tools.add_retriever_tool(self.file_url, self.company_name)
        

        return tools.get_tools()
