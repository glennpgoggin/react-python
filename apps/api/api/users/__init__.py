# Expose key components for easier imports
from .models import User
from .schemas import UserCreateSchema, UserSchema
from .repository import create_user, get_user_by_email, get_user_by_id
from .service import register_user, fetch_user
from .router import router
