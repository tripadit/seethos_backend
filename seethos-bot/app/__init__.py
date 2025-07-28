from typing import Optional

from fastapi import FastAPI

_app: Optional[FastAPI] = None


def create_app() -> FastAPI:
    app = FastAPI(openapi_url="/api/openapi.json", docs_url="/api/docs", redoc_url=None, title="Chatbot API",)

    # routes section here
    from app.chat import router as bot_router
    app.include_router(bot_router, tags=["Bot Router"])

    @app.get("/", tags=["Root"])
    async def root():
        return {"message": "Welcome to Chatbot!"}

    return app


def get_app() -> FastAPI:
    global _app

    if _app is None:
        _app = create_app()

    return _app
