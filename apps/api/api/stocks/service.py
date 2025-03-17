from .repository import (get_all_stocks,get_stock_by_symbol, create_stock,update_stock, delete_stock, get_nbbo_price)
from api.currency import Currency

async def list_stocks():
    return await get_all_stocks()

async def get_stock_details(symbol: str):
    stock = await get_stock_by_symbol(symbol)
    if not stock:
        raise ValueError(f"Stock {symbol} not found")
    return stock

async def fetch_nbbo_price(symbol: str):
    nbbo_data = await get_nbbo_price(symbol)
    if not nbbo_data:
        return None
    return nbbo_data

async def add_stock(symbol: str, name: str, price_in_cents: int, currency: Currency, logo_url: str = None):
    existing_stock = await get_stock_by_symbol(symbol)
    if existing_stock:
        raise ValueError(f"Stock with symbol {symbol} already exists")
    return await create_stock(symbol, name, price_in_cents, currency, logo_url)

async def modify_stock(symbol: str, name: str, price_in_cents: int, currency: Currency, logo_url: str = None):
    stock = await update_stock(symbol, name, price_in_cents, currency, logo_url)
    if not stock:
        raise ValueError(f"Stock {symbol} not found")
    return stock

async def remove_stock(symbol: str):
    success = await delete_stock(symbol)
    if not success:
        raise ValueError(f"Stock {symbol} not found")
    return {"message": f"Stock {symbol} deleted successfully"}