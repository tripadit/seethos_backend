from typing import Optional

from fastapi import FastAPI

_app: Optional[FastAPI] = None


def create_app() -> FastAPI:
    app = FastAPI()

    # route section here
    from app.bot_manager import router as bot_manager_router

    app.include_router(bot_manager_router, tags=["Bot Manager"])

    @app.get("/", tags=["Root"])
    async def root():
        return {"message": "Welcome to FastAPI."}

    return app


def get_app() -> FastAPI:
    global _app

    if _app is None:
        _app = create_app()

    return _app
