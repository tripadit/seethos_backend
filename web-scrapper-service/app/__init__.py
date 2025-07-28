from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.celery_utils import create_celery


def create_app() -> FastAPI:
    app = FastAPI()

    # configure celery with app
    app.celery_app = create_celery()

    # cors to allow requests from any origin
    app.add_middleware(
        CORSMiddleware,
        allow_origins=["*"],
        allow_credentials=False,
        allow_methods=["POST"],
        allow_headers=["*"],
    )

    # routes
    from app.scrapper import router as scrapper_router
    app.include_router(scrapper_router, tags=["Scrapper Router"])

    @app.get("/", tags=["Default"])
    async def root():
        return {"message": "Server is up !!"}

    return app
