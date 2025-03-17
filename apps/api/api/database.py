import api.config as config
from tortoise import Tortoise
from tortoise.contrib.fastapi import register_tortoise
from fastapi import FastAPI

TORTOISE_ORM = {
    "connections": {"default": config.DATABASE_URL},
    "apps": {
        "models": {
            "models": ["api.users.models","api.stocks.models","api.orders.models", "aerich.models"], 
            "default_connection": "default",
        }
    }
}

def init_db(app: FastAPI):
    register_tortoise(
        app,
        config=TORTOISE_ORM,
        generate_schemas=False, 
        add_exception_handlers=True,
    )
