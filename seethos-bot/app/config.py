import os
from functools import lru_cache
from dotenv import load_dotenv 

load_dotenv()

class BaseConfig:
    MONGODB_URI = os.environ.get("MONGODB_URI", "")
    OPENAI_API_KEY = os.environ.get("OPENAI_API_KEY", "")

    AWS_BUCKET_NAME = os.environ.get("AWS_BUCKET_NAME", "seethoschatbotai-test-bucket")
    AWS_REGION = os.environ.get("AWS_REGION", "us-east-1")

    API_SERVER_URL = os.environ.get("API_SERVER_URL", "https://api.admin.seethoschatbot.com")


class DevelopmentConfig(BaseConfig):
    pass


class ProdConfig(BaseConfig):
    pass


@lru_cache()
def get_settings():
    config_cls_dist = {
        "dev": DevelopmentConfig,
        "prod": ProdConfig
    }

    config_name = os.environ.get("FAST_API_CONFIG", "dev")
    config_cls = config_cls_dist[config_name]
    return config_cls


settings = get_settings()
