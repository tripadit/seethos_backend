from fastapi import WebSocket


class ConnectionManager:

    def __init__(self):
        self.websocket = None
        self.active_connections: list[WebSocket] = []

    async def connect(self, websocket: WebSocket):
        self.websocket = websocket
        await websocket.accept()

    async def send_message(self, message: str):
        await self.websocket.send_text(message)

    async def receive_message(self):
        return await self.websocket.receive_text()

    async def receive_bytes(self):
        return await self.websocket.receive()
