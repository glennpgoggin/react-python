from pydantic import BaseModel, field_serializer
from typing import List, Optional
from enum import Enum
from datetime import datetime
from api.currency import Currency, Money
from api.stocks.schemas import StockSchema

class OrderType(str, Enum):
    market = "market"
    limit = "limit"

class OrderStatus(str, Enum):
    complete = "complete"
    pending = "pending"

class OrderItemSchema(BaseModel):
    stock: StockSchema
    quantity: int
    order_type: OrderType
    status: OrderStatus = OrderStatus.pending
    limit_price_in_cents: Optional[int] = None
    executed_price_in_cents: Optional[int] = None
    currency: Currency = Currency.USD


    @field_serializer("limit_price_in_cents", "executed_price_in_cents")
    def serialize_price(self, value: Optional[int]) -> Optional[Money]:
        """Converts price fields into Money objects for serialization"""
        if value is None:
            return None
        return Money(amount_in_cents=value, currency=self.currency)

class OrderItemCreateSchema(BaseModel):
    stock_symbol: str
    quantity: int
    order_type: OrderType
    status: OrderStatus = OrderStatus.pending
    limit_price_in_cents: Optional[int] = None
    executed_price_in_cents: Optional[int] = None
    currency: Currency = Currency.USD

class OrderCreateSchema(BaseModel):
    user_id: int
    items: List[OrderItemCreateSchema]

class OrderSchema(BaseModel):
    id: int
    user_id: int
    status: OrderStatus = OrderStatus.pending
    created_at: datetime
    items: List[OrderItemSchema]
