from app.bot.AgentConfigData import AgentConfigData
from app.bot.Tools import Tools
from app.config import settings
import requests

class EmailSequenceGeneratorBot:
    def __init__(self, assistant_id,runtime_traning_file=None,system_prompt=None) -> None:
        self.vector_db = None
        self.id = assistant_id
        self.name = None
        self.company_name = None
        self.assistant_role = None
        self.questions = None
        self.call_to_action_prompt = None
        self.greeting_message = None
        self.file_url = None
        self.config_url = f"https://s3.{settings.AWS_REGION}.amazonaws.com/{settings.AWS_BUCKET_NAME}/{assistant_id}/{assistant_id}_config.json"
        self.learn_yourself()
        self.run_time_training_file = runtime_traning_file
        self.system_prompt = system_prompt
        self.agent = self.process_llm_agent()


    def learn_yourself(self):
        response = requests.get(self.config_url)
        bot_config = response.json()

        for key, value in bot_config.items():
            if hasattr(self, key):
                setattr(self, key, value)

        response = requests.get(self.file_url)
        response.raise_for_status()

        self.vector_db = response.content

    def process_llm_agent(self):
        agent = AgentConfigData()

        tools = self.tools_generator()

        #agent.generate_message(self.name, self.company_name)
        agent.generate_email_sequence(self.system_prompt)
        agent.add_agent(tools)

        return agent
    
    def tools_generator(self):
        tools = Tools()
        tools.add_retriever_tool(
            file_url=self.file_url,
            company_name=self.company_name
        )

        #check if runtime training file is present
        
        if self.run_time_training_file:
            tools.campaign_traning_tool(self.run_time_training_file)

        return tools.get_tools()
    