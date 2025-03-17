from .models import Stock
from api.currency import Money, Currency
from datetime import datetime
import random

async def get_all_stocks():
    return await Stock.all()

async def get_stock_by_symbol(symbol: str):
    return await Stock.filter(symbol=symbol).first()

async def get_nbbo_price(symbol: str):

    stock = await Stock.get_or_none(symbol=symbol)
    
    if not stock:
        return None

    # Simulate real-time NBBO prices 
    bid = round(stock.price_in_cents * (1 - random.uniform(0.001, 0.005)))
    ask = round(stock.price_in_cents * (1 + random.uniform(0.001, 0.005)))

    return {
        "symbol": symbol,
        "bid": bid / 100,  # Convert cents to dollars
        "ask": ask / 100,
        "price_last_updated_at": datetime.utcnow().isoformat()
    }

async def create_stock(symbol: str, name: str, price_in_cents: int, currency: Currency, logo_url: str = None):
    stock = await Stock.create(symbol=symbol, name=name, price_in_cents=price_in_cents,currency=currency, logo_url=logo_url)
    return stock

async def update_stock(symbol: str, name: str, price_in_cents: int, currency: Currency, logo_url: str = None):
    stock = await get_stock_by_symbol(symbol)
    if not stock:
        return None
    stock.name = name
    stock.price_in_cents = price_in_cents
    stock.currency = currency
    stock.logo_url = logo_url
    await stock.save()
    return stock


async def delete_stock(symbol: str):
    stock = await get_stock_by_symbol(symbol)
    if not stock:
        return False
    await stock.delete()
    return True