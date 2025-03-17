from fastapi import APIRouter, HTTPException
from .service import register_user, fetch_user
from .schemas import UserCreateSchema, UserSchema

router = APIRouter(prefix="/users", tags=["users"])

@router.post("/", response_model=UserSchema, status_code=201)
async def create_user(user_data: UserCreateSchema):
    try:
        return await register_user(user_data.name, user_data.email, user_data.password)
    except ValueError as e:
        raise HTTPException(status_code=400, detail=str(e))

@router.get("/{user_id}", response_model=UserSchema)
async def get_user(user_id: int):
    try:
        return await fetch_user(user_id)
    except ValueError as e:
        raise HTTPException(status_code=404, detail=str(e))
