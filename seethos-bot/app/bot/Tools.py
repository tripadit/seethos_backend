import pickle

import requests
from langchain.agents import Tool
from langchain.agents.agent_toolkits import create_retriever_tool

from app.config import settings


class Tools:

    @staticmethod
    def create_meet_tool(bot_id: str, session_id: str):
        return {
            "calendy": f"https://api.admin.seethoschatbot.com/api/v1/conversion/update_conversion/?bot_id={bot_id}&session_id={session_id}"
        }

    @staticmethod
    def load_vector_database(file_url):
        response = requests.get(file_url)
        response.raise_for_status()

        vectors = pickle.loads(response.content)

        return vectors.as_retriever()

    def __init__(self):
        self.tools = []
        #self.meet_tool = None
        self.retriever_tool = None
        self.campaign_training_tool = None

    # def add_meet_tool(self, subdomain, session_id, call_to_action_prompt):
    #     self.meet_tool = Tool(
    #         name="CA_Tool",
    #         func=lambda: Tools.create_meet_tool(subdomain, session_id),
    #         description=f"use {call_to_action_prompt}"
    #     )
    #     self.tools.append(self.meet_tool)

    def add_retriever_tool(self, file_url, company_name):
        if file_url:
            self.retriever_tool = create_retriever_tool(
                Tools.load_vector_database(file_url),
                "search_content_for_company",
                f"Searches and returns documents regarding {company_name}.",
            )
            self.tools.append(self.retriever_tool)
        else:
            import logging
            logging.warning("file_url is None or empty. Skipping addition of retriever tool.")

    def campaign_traning_tool(self,runtime_training_file):
        self.campaign_training_tool = create_retriever_tool(
            Tools.load_vector_database(runtime_training_file),
            "search_content_for_campaign",
            f"Searches and returns documents regarding campaign.",
        )   
        self.tools.append(self.campaign_training_tool)

    def get_tools(self):
        return self.tools
