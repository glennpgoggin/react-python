from tortoise import fields, models
from tortoise.contrib.pydantic import pydantic_model_creator
from tortoise import fields
from api.users.models import User
from api.stocks.models import Stock
from .schemas import OrderStatus, OrderType
from api.currency import Currency;

class Order(models.Model):
    id = fields.IntField(pk=True)
    user = fields.ForeignKeyField("models.User", related_name="orders")
    status = fields.CharEnumField(OrderStatus, default=OrderStatus.pending)
    created_at = fields.DatetimeField(auto_now_add=True)

    class Meta:
        table = "orders"

class OrderItem(models.Model):
    id = fields.IntField(pk=True)
    order = fields.ForeignKeyField("models.Order", related_name="items")
    stock = fields.ForeignKeyField("models.Stock", related_name="order_items")
    status = fields.CharEnumField(OrderStatus, default=OrderStatus.pending)
    order_type = fields.CharEnumField(OrderType)
    quantity = fields.IntField()
    limit_price_in_cents = fields.IntField(null=True)  
    executed_price_in_cents = fields.IntField(null=True) 
    currency = fields.CharEnumField(Currency, default=Currency.USD)

    class Meta:
        table = "order_items"

Order_Pydantic = pydantic_model_creator(Order, name="Order")
OrderItem_Pydantic = pydantic_model_creator(OrderItem, name="OrderItem")