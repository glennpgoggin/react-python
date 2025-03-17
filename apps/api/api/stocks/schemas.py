from pydantic import BaseModel, model_serializer
from typing import Optional
from datetime import datetime
from api.currency import Currency, Money

class StockSchema(BaseModel):
    id: int
    symbol: str
    name: str
    price_in_cents: int
    price_last_updated_at: datetime
    currency: Currency = Currency.USD  
    logo_url: Optional[str]

    @model_serializer
    def serialize(self) -> dict:
        """Serialized for the API"""
        return {
            "id": self.id,
            "symbol": self.symbol,
            "name": self.name,
            "price": Money(amount_in_cents=self.price_in_cents, currency=self.currency),
            "price_last_updated_at": self.price_last_updated_at,
            "logo_url": self.logo_url,
        }

class StockCreateSchema(BaseModel):
    symbol: str
    name: str
    price_in_cents: int
    currency: str
    logo_url: Optional[str]

class StockUpdateSchema(BaseModel):
    name: str
    price_in_cents: int
    currency: str
    logo_url: Optional[str]