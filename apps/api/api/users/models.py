from tortoise import fields, models
from tortoise.contrib.pydantic import pydantic_model_creator
from tortoise import fields


class User(models.Model):
    id = fields.IntField(pk=True)
    name = fields.CharField(max_length=100)
    email = fields.CharField(max_length=255, unique=True)
    hashed_password = fields.CharField(max_length=255)
    created_at = fields.DatetimeField(auto_now_add=True)

    class Meta:
        table = "users"


User_Pydantic = pydantic_model_creator(User, name="User")