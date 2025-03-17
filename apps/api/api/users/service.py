from .repository import create_user, get_user_by_email, get_user_by_id
from passlib.context import CryptContext

pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")

async def register_user(name: str, email: str, password: str):
    existing_user = await get_user_by_email(email)
    if existing_user:
        raise ValueError("User with this email already exists.")
    hashed_password = pwd_context.hash(password)  # ✅ Hash the password before storing
    return await create_user(name, email, hashed_password)

async def fetch_user(user_id: int):
    user = await get_user_by_id(user_id)
    if not user:
        raise ValueError("User not found.")
    return user
