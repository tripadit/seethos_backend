import json
from typing import List, Optional

from fastapi import APIRouter, UploadFile, File, Form, HTTPException
from pydantic import BaseModel

import app.pdf_processor as pdf_processor
from app.s3.s3_client import s3client
from app.config import settings

router = APIRouter()

class BotRequest(BaseModel):
    bot_id: str
    name: Optional[str]
    company_name: Optional[str]
    avatar_url: Optional[str]
    questions: Optional[List[str]] = []
    language: Optional[str] = "en"
    color: Optional[str] = "blue"
    conversation_start_flow: Optional[str] = "Hi, I'm a bot"
    conversation_end_flow: Optional[str] = "Bye, I'm a bot"
    greeting_message: Optional[str] = "Ask me anything"
    call_to_action_prompt: Optional[str] = "when user asks to setup a meeting"
    greeting_tags: Optional[List[str]] = ["Hello", "Hi", "Hey"]
    subscription_type: Optional[str] = "LOW"
    calendly: Optional[str] = None
    assistant_role: Optional[str] = "Sales Assistant"
    system_prompt: Optional[str] = ""

@router.post("/bot/create_or_update/")
async def create_or_update(
    bot_id: str = Form(...),
    name: str = Form(...),
    company_name: str = Form(...),
    avatar_url: Optional[str] = Form(None),
    questions: Optional[str] = Form(None),  # JSON string, converted on the server
    language: str = Form("en"),
    color: str = Form("blue"),
    conversation_start_flow: str = Form("Hi, I'm a bot"),
    conversation_end_flow: str = Form("Bye, I'm a bot"),
    greeting_message: str = Form("Ask me anything"),
    call_to_action_prompt: str = Form("when user asks to setup a meeting"),
    greeting_tags: Optional[str] = Form("[]"),  # JSON string, converted on the server
    subscription_type: str = Form("LOW"),
    calendly: Optional[str] = Form(None),
    assistant_role: str = Form("Sales Assistant"),
    system_prompt: Optional[str] = Form(""),
    training_data: UploadFile = File(...),
):
    print(f"Received create_or_update request for bot_id: {bot_id}")
):
    # Convert stringified JSON fields to Python objects
    try:
        questions_list = json.loads(questions) if questions else []
        greeting_tags_list = json.loads(greeting_tags) if greeting_tags else []
    except json.JSONDecodeError:
        raise HTTPException(status_code=400, detail="Invalid JSON in 'questions' or 'greeting_tags'")

    # Process the training data
    raw_training_data = await training_data.read()
    print(f"DEBUG: Raw training data length: {len(raw_training_data)} bytes")
    if not raw_training_data:
        raise HTTPException(status_code=400, detail="Uploaded training data is empty")
    processed_data = pdf_processor.process_pdf_and_create_pkl(raw_training_data)
    print(f"DEBUG: Processed data length: {len(processed_data)} bytes")

    # Upload the processed data and environment config to S3
    data_url = s3client.upload_file_to_s3(f"{bot_id}/{bot_id}_vector_database.pkl", processed_data)
    env_vars = {
        "bot_id": bot_id,
        "name": name,
        "company_name": company_name,
        "avatar_url": avatar_url,
        "questions": questions_list,
        "language": language,
        "color": color,
        "conversation_start_flow": conversation_start_flow,
        "conversation_end_flow": conversation_end_flow,
        "greeting_message": greeting_message,
        "call_to_action_prompt": call_to_action_prompt,
        "file_url": data_url,
        "greeting_tags": greeting_tags_list,
        "subscription_type": subscription_type,
        "calendly": calendly,
        "assistant_role": assistant_role,
        "system_prompt": system_prompt,
    }
    print(f"DEBUG: Environment variables for config: {json.dumps(env_vars, indent=2)}")
    config_url = s3client.upload_file_to_s3(f"{bot_id}/{bot_id}_config.json", json.dumps(env_vars))

    return {
        "message": f"Chatbot deployed! Access at: https://{bot_id}.bots.{settings.SITE_DOMAIN}",
        "data_url": data_url,
        "config_url": config_url,
    }