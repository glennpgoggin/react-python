from tortoise import fields, models
from tortoise.contrib.pydantic import pydantic_model_creator
from api.currency import Currency, Money;

class Stock(models.Model):
    id = fields.IntField(pk=True)
    symbol = fields.CharField(10, unique=True, index=True)
    name = fields.CharField(50)
    price_in_cents = fields.IntField(default=0)
    price_last_updated_at = fields.DatetimeField(auto_now=True) 
    currency = fields.CharEnumField(Currency, default=Currency.USD)
    logo_url = fields.CharField(255, null=True)
    price: Money
    
    class Meta:
        table = "stocks"

    def __str__(self):
        return f"{self.symbol} - {self.name}"

Stock_Pydantic = pydantic_model_creator(Stock, name="Stock")


