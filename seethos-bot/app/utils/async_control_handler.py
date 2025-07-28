from typing import Dict, Any, List

from fastapi import WebSocket
from langchain.callbacks.base import BaseCallbackHandler
from langchain.schema import LLMResult


class MyCustomAsyncHandler(BaseCallbackHandler):
    """Async callback handler that can be used to handle callbacks from langchain."""

    def __init__(self, websocket: WebSocket, session_id: str):
        self.websocket = websocket
        self.session_id = session_id

    # def on_chat_model_start(self) -> None:
    #     """Run when chat model starts running."""
    #     print("Hi! I just woke up. Your chat model is starting")

    def on_llm_start(
            self, serialized: Dict[str, Any], prompts: List[str], **kwargs: Any
    ) -> None:
        """Run when chain starts running."""
        print("Hi! I just woke up. Your llm is starting")

    async def on_llm_new_token(self, token: str, **kwargs) -> None:
        """Run when new token is generated."""
        print("this is new token", token)
        await self.websocket.send_text(token)
        # await send_message_to_session(self.session_id, token)

    async def on_llm_end(self, response: LLMResult, **kwargs: Any) -> None:
        """Run when chain ends running."""
        print("I'm going to sleep. Your llm is done running")
        await self.websocket.send_text('end of the chain')

    def raise_error(self, error: Exception) -> None:
        """Run when an error occurs."""
        print("Oops! Something went wrong. Here's the error:", error)
