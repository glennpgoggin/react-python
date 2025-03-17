from typing import Optional
from pydantic import BaseModel, model_serializer
from babel.numbers import format_currency

class Money(BaseModel):
    amount_in_cents: int
    currency: str

    @model_serializer
    def serialize(self) -> dict:
        """Ensure computed properties are included in API response."""
        return {
            "amount_in_cents": self.amount_in_cents,
            "amount": self.amount_in_cents / 100,  
            "currency": self.currency,
            "formatted": format_currency(self.amount_in_cents / 100, self.currency, locale='en_US'),  
        }

    def __str__(self):
        """String representation for debugging."""
        return self.serialize()["formatted"]
