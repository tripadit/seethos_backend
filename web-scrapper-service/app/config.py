import os
import pathlib
from functools import lru_cache

from dotenv import load_dotenv


class BaseConfig:
    # load environment variables from .env file
    load_dotenv()

    BASE_DIR: pathlib.Path = pathlib.Path(__file__).parent.parent

    # celery config
    CELERY_BROKER_URL = os.environ.get("CELERY_BROKER_URL", "redis://redis/0")


class DevelopmentConfig(BaseConfig):
    pass


class ProductionConfig(BaseConfig):
    pass


@lru_cache()
def get_settings():
    config_cls_dist = {
        "dev": DevelopmentConfig,
        "prod": ProductionConfig,
    }

    config_name = os.environ.get("FAST_API_CONFIG", "dev")
    config_cls = config_cls_dist[config_name]
    return config_cls


settings = get_settings()
