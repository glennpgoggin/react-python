from pydantic import BaseModel, EmailStr
from typing import Optional
from datetime import datetime
class UserCreateSchema(BaseModel):
    name: str
    email: EmailStr
    password: str  # Plaintext, will be hashed before storing

class UserSchema(BaseModel):
    id: int
    name: str
    email: EmailStr
    created_at: datetime

    class Config:
        from_attributes = True  
