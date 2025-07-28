from langchain.agents import OpenAIFunctionsAgent, AgentExecutor
from langchain.chat_models import ChatOpenAI
from langchain.prompts import MessagesPlaceholder
from langchain.schema import SystemMessage
import requests

from app.config import settings


class AgentConfigData:

    def __init__(self):
        self.prompt = None
        self.agent = None
        self.agent_executor = None
        self.message = None

        self.llm = ChatOpenAI(temperature=0, streaming=True, model="gpt-4-1106-preview",
                              openai_api_key=settings.OPENAI_API_KEY,max_tokens=4000)

    def add_agent(self, tools):
        # generate prompt for tools
        self.prompt = OpenAIFunctionsAgent.create_prompt(
            system_message=self.message,
            extra_prompt_messages=[MessagesPlaceholder(variable_name="history")],
        )
        # Create the OpenAIFunctionsAgent
        self.agent = OpenAIFunctionsAgent(llm=self.llm, tools=tools, prompt=self.prompt)
        # Create an AgentExecutor
        self.agent_executor = AgentExecutor(agent=self.agent, tools=tools, verbose=True,
                                            return_intermediate_steps=True)

    def generate_message(self, name, company_name, assistant_role="", questions="", system_prompt=""):
        #try:
            
            print(system_prompt)
            system_prompt = system_prompt.replace("__Name__", name)
            system_prompt = system_prompt.replace("__AssistantRole__", assistant_role)
            system_prompt = system_prompt.replace("__Questions__", str(questions))
            system_prompt = system_prompt.replace("__CompanyName__", company_name)
            self.message = SystemMessage(
                content=system_prompt
            )
            print(self.message,"message")
        # except:
        #     self.message = SystemMessage(
        # #         content=(
        #             f"""You are an expert {assistant_role} named {name} from {company_name}.  Your role is to greet the guests visiting {company_name}'s website.
        #             It is your responsibility to ask questions, store the results for further use, and answer questions based on the information you have about {company_name}.
        #             If you don't know the answer to a question, please kindly share that you do not know the answer.
            
        #             Your tone and approach should always be professional, courteous, and kind throughout the entire conversation.  You want to ask and answer questions in a very human way.  For example, you might tell the guest that they've asked a great question.  Or you might respond by saying that you need to think about the question or look up the answer to their question.
            
        #             Begin by introducing yourself, thanking the guest for visiting {company_name}'s website, ask them to please let you know if there is anything you can "quickly help" them with, and ask {questions} from the guest, one question for each piece of information.
            
        #             Ask all of the {questions} to the visitor.
            
        #             Don't hesitate to ask the {questions} again if the guest doesn't provide you an answer the first time.
            
        #             Ask the guest one question at a time.
            
        #             If a guest asks you a question in response to your question, make sure to answer them and then politely ask your question again until you have the answer. 
            
        #             Thank the guest when they answer a question.
            
        #             If the guest's question is not related to your company or your role, you can simply reply with "That is a great question but I don't know the answer.  I am simply a humble {assistant_role} for {company_name} but I can certainly help you with any questions you may have about the company."
            
        #             If the guest has not answered {questions} then ask them again.
            
        #             Your output should be as short as a human would prefer and usually much less than 200 words.
            
            
        #             Begin the conversation:"""
        #         )
        #     )

    def generate_email_sequence(self,system_prompt):
        self.llm = ChatOpenAI(temperature=0, streaming=True, model="gpt-4-1106-preview",
                              openai_api_key=settings.OPENAI_API_KEY,response_format={"type": "json_object", },)
        self.message = SystemMessage(
           content = (system_prompt + "generate list of exactly 8 email_responses  to the following schema: {'email_responses':[{'subject': 'Subject Line', 'body': 'email format with basic html with <p> and <br> tags only. Do not use <html> tag also.'}]}")
        )
