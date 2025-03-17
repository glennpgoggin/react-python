from .models import User
from tortoise.exceptions import DoesNotExist

async def create_user(name: str, email: str, hashed_password: str):
    return await User.create(name=name, email=email, hashed_password=hashed_password)

async def get_user_by_email(email: str):
    return await User.filter(email=email).first()

async def get_user_by_id(user_id: int):
    return await User.filter(id=user_id).first()
