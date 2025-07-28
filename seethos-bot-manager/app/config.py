import os
from functools import lru_cache
from dotenv import load_dotenv

load_dotenv()

class BaseConfig:
    # set aws config variables
    AWS_ACCESS_KEY_ID = os.environ.get("AWS_ACCESS_KEY_ID", "access-key")
    AWS_SECRET_ACCESS_KEY = os.environ.get("AWS_SECRET_ACCESS_KEY", "secret-key")
    BUCKET_NAME = os.environ.get("BUCKET_NAME", "bucket-name")
    AWS_REGION = os.environ.get("AWS_REGION", "us-east-1")
    SITE_DOMAIN = os.environ.get("SITE_DOMAIN", "")


class DevelopmentConfig(BaseConfig):
    pass


@lru_cache()
def get_settings():
    config_cls_dist = {
        "dev": DevelopmentConfig
    }

    config_name = os.environ.get("FAST_API_CONFIG", "dev")
    config_cls = config_cls_dist[config_name]
    return config_cls()


settings = get_settings()
