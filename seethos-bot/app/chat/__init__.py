import datetime
from enum import Enum
import json
from typing import List

import websockets
from fastapi import APIRouter, Request
from fastapi import BackgroundTasks
from fastapi import WebSocket, Query
from fastapi.templating import Jinja2Templates
from langchain.agents.openai_functions_agent.agent_token_buffer_memory import (
    AgentTokenBufferMemory,
)
from langchain.schema import AIMessage
from langchain.schema import HumanMessage

from app.config import settings
from app.utils.async_control_handler import MyCustomAsyncHandler
from stt import transcribe
from tts import to_speech
import requests
from urllib.parse import parse_qs


from pydantic import BaseModel

router = APIRouter()

templates = Jinja2Templates(directory="templates")

conversion = "false"


@router.get("/home")
async def home(request: Request):
    host_header = request.headers.get("Host")
    print(request.headers)
    print("host header: ", host_header)
    subdomain = None
    if host_header and "." in host_header and not host_header.startswith("localhost"):
        subdomain = host_header.split('.')[0]
    else:
        subdomain = "default_bot_id"  # Replace with a valid fallback

    print("subdomain: " + subdomain)

    import requests

    # https://api.admin.seethoschatbot.com/api/v1/bot_info/get_chatbot_info/?bot_id=bot9e04d425
    print(f"Attempting to fetch bot info from: {settings.API_SERVER_URL}/api/v1/bot_info/get_chatbot_info/?bot_id={subdomain}")
    datas = requests.get(
        f'{settings.API_SERVER_URL}/api/v1/bot_info/get_chatbot_info/?bot_id={subdomain}').json()

    print("datas: \n" + str(datas))

    data = {
        "botId": subdomain,
        'company_name': datas.get('company_name', "My Company"),
        "company_logo": datas.get('company_logo', "https://via.placeholder.com/150"),

    }
    return templates.TemplateResponse("index.html", {"request": request, "data": data})

@router.get("/{id}")
def home_by_path(id: str, request: Request):
    datas = requests.get(
    f'{settings.API_SERVER_URL}/api/v1/bot_info/get_chatbot_info/?bot_id={id}').json()

    print("datas: \n" + str(datas))

    data = {
        "botId": id,
        'company_name': datas.get('company_name', "My Company"),
        "company_logo": datas.get('company_logo', "https://via.placeholder.com/150"),

    }
    return templates.TemplateResponse("index.html", {"request": request, "data": data })


def get_requesting_subdomain(websocket: WebSocket):
    host_header = websocket.headers.get("Host")
    subdomain = None
    if host_header and "." in host_header and not host_header.startswith("localhost"):
        subdomain = host_header.split('.')[0]
    else:
        subdomain = "default_bot_id"  # Replace with a valid fallback

    return subdomain

@router.websocket("/bws/{bot_id}/")
async def websocket_by_id(websocket: WebSocket,bot_id:str,
                        #   id: str = Query(..., description="Unique bot ID"),
                        #   session_id=Query(..., description="Unique session ID")
                          ):
    query_params = parse_qs(websocket.url.query)
    session_id = query_params.get('session_id', [''])[0]
    print(bot_id)
    await websocket_route(bot_id, session_id, websocket)


@router.websocket("/ws/")
async def websocket_endpoint(websocket: WebSocket,
                             session_id: str = Query(..., description="Unique session ID"),
                             bot_id: str = Query(None, description="Unique bot ID")):
    print("connection request")
    if bot_id is None:
        subdomain = get_requesting_subdomain(websocket)
    else:
        subdomain = bot_id
    await websocket_route(subdomain, session_id, websocket)


async def websocket_route(subdomain, session_id, websocket: WebSocket, bot_id=None):
    from app.bot.UnrealBot import seethoschatbotBot
    print(f"Using bot_id: {subdomain}")
    try:
        bot = seethoschatbotBot(subdomain, session_id)
        print(bot)

        await bot.chat_manager.connect(websocket)

        history = {}
        starter_message = bot.greeting_message
        background_tasks = BackgroundTasks()

        # check is session_id is in mongo is not then create a new document
        try:
            if bot.chat_history.conversations.find_one({"session_id": session_id}) is None:
                conversation_data = {
                    "conversion": conversion,
                    "created_at": datetime.datetime.utcnow(),
                    "query_counter": bot.chat_history.query_count,
                    "session_id": session_id,
                    "session_info": [{
                        "user": '',
                        "assistant": starter_message,
                        "timestamp": datetime.datetime.utcnow()
                    }]
                }
                result = bot.chat_history.conversations.insert_one(conversation_data)
                _id = result.inserted_id
            else:
                conversation_data = bot.chat_history.conversations.find_one({"session_id": session_id})
                # create a new document

                _id = conversation_data['_id']
                query_counter = conversation_data['query_counter']
        except:
            pass

        await bot.chat_manager.send_message(starter_message)
        await bot.chat_manager.send_message("end of the greeting message")
        memory = AgentTokenBufferMemory(llm=bot.agent.llm)

        while True:
            audio = False
            try:
                if "messages" not in history:
                    history["messages"] = [AIMessage(content=starter_message)]

                # Receive message from WebSocket
                data = await bot.chat_manager.receive_bytes()
                print("data", data)
                message = ''
                # Determine if the message is text (JSON) or binary (audio)
                try:
                    if data["text"]:
                        message = json.loads(data["text"])
                        print("message", message)
                        # Check if the message is an indicator for an upcoming audio file
                        if message.get("type") == "audio":
                            # Prepare to receive binary data (audio file) in the next frame
                            print("Audio message indicator received")
                            data = await bot.chat_manager.receive_bytes()
                            # print all the keys of data
                            print("data keys", data.keys())
                            file_name = f"file_{datetime.datetime.now().strftime('%Y%m%d%H%M%S')}.wav"
                            with open(file_name, "wb") as f:
                                f.write(data['bytes'])
                            print("Audio file received")
                            audio = True

                            message = await transcribe(file_name)
                            # send user message to websocket
                            await bot.chat_manager.send_message("start user message")
                            await bot.chat_manager.send_message(message)
                            await bot.chat_manager.send_message("end user message")

                        else:
                            # Handle text data
                            print("Text message received:", message)
                            message = message["content"]
                except:
                    pass
                try:
                    if data["bytes"]:
                        # Handle binary data (audio file)
                        audio_data = data["bytes"]
                        file_name = f"file_{datetime.datetime.now().strftime('%Y%m%d%H%M%S')}.wav"
                        with open(file_name, "wb") as f:
                            f.write(audio_data)
                        message = await transcribe(file_name)
                        audio = True
                        # send user message to websocket
                        await bot.chat_manager.send_message("start user message")
                        await bot.chat_manager.send_message(message)
                        await bot.chat_manager.send_message("end user message")
                        # Process the audio_data as needed
                        print("Audio file received")

                except:
                    pass

                if message != "":

                    memory.chat_memory.add_message(HumanMessage(content=message))

                    #try:
                    call_back = MyCustomAsyncHandler(websocket, session_id)
                    response = bot.agent.agent_executor({"input": message, "history": history['messages']},
                                                        callbacks=[call_back],
                                                        include_run_info=True)
                    # increase query count
                    bot.chat_history.inc_query_count()

                    memory.chat_memory.add_message(AIMessage(content=response["output"]))
                    memory.save_context({"input": message}, response)
                    history["messages"] = memory.buffer
                    # except:
                    #     response = {}
                    #     response["output"] = "service is currently down. Please try again later."
                    # Add the assistant message to the memory

                    # check if mongo
                    try:
                        bot.chat_history.conversations.update_one(
                            {
                                "_id": _id
                            },
                            {
                                "$set": {"query_counter": bot.chat_history.query_count},
                                "$push": {
                                    "session_info": {
                                        "user": message,
                                        "assistant": response['output'],
                                        "timestamp": datetime.datetime.utcnow()
                                    }
                                }
                            }
                        )
                    except:
                        pass

                    # Send response back to WebSocket
                    await bot.chat_manager.send_message(response["output"])
                    await websocket.send_text("end of the chain")
                    if audio:
                        tts = await to_speech(response["output"], background_tasks)
                        # send audio data to websocket
                        await websocket.send_text("starting audio")
                        # sent bytes
                        with open(tts, "rb") as f:
                            await websocket.send_bytes(f.read())
                        await websocket.send_text("end of audio")

            except websockets.exceptions.ConnectionClosedError:
                break
    except requests.exceptions.HTTPError as e:
        await websocket.send_text(f"Error: Could not load bot configuration. Please ensure the bot ID is correct and the configuration exists in S3. Details: {e}")
    except Exception as e:
        await websocket.send_text(f"An unexpected error occurred: {e}")


class MessageType(str, Enum):
    HUMAN = "Human"
    AI = "AI"


class Message(BaseModel):
    message: str
    type: MessageType


class EmailReplyRequest(BaseModel):
    message: str
    history: List[Message]

class EmaliSequenceRequest(BaseModel):
    message: str
    system_prompt: str  
    file_url: str = None


@router.post("/api/{assistant_id}/email-reply", response_model=str)
async def email_reply(assistant_id:str, requestBody: EmailReplyRequest):
    from app.bot.EmailReplyBot import EmailReplyBot
    email_reply_bot = EmailReplyBot(assistant_id)

    history = []
    for message in requestBody.history:
        if message.type == MessageType.HUMAN:
            history.append(HumanMessage(content=message.message))
        else:
            history.append(AIMessage(content=message.message))

    response = email_reply_bot.agent.agent_executor({"input": requestBody.message, "history": history},)

    return response.get("output")

#api to generate email sequence
#api to generate email sequence
@router.post("/api/{assistant_id}/email-sequence",response_model=dict)
async def email_sequence(assistant_id:str, requestBody: EmaliSequenceRequest):
    from app.bot.EmailSequenceGeneratorBot import EmailSequenceGeneratorBot
    email_reply_bot = EmailSequenceGeneratorBot(assistant_id, requestBody.file_url, requestBody.system_prompt)

    response = email_reply_bot.agent.agent_executor({"input": requestBody.message +" .Reply in json format", "history": []},)

    #convert output to json
    
    
    try:
        json_output = json.loads(str(response.get("output")))
        return json_output
    except Exception as e:
        print(e)
        return {"error": "Error in generating email sequence due to{}".format(e)}