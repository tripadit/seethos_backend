
import uvicorn

from app import create_app

app = create_app()
celery = app.celery_app

if __name__ == "__main__":
    uvicorn.run(app, host="0.0.0.0", port=8011)
