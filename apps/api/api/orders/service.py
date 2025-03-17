from .repository import create_order, get_orders_by_user, get_order_by_id
from .models import OrderType, OrderStatus
from api.stocks import get_stock_by_symbol
from api.users import get_user_by_id

async def buy_stock(user_id: int, items: list):
    user = await get_user_by_id(user_id)
    if not user:
        raise ValueError("User not found")
    
    order_items = []
    for item in items:
        stock = await get_stock_by_symbol(item.stock_symbol)
        if not stock:
            raise ValueError(f"Stock {item.stock_symbol} not found")

   
        if item.currency != stock.currency:
            raise ValueError(f"Currency mismatch: {item.stock_symbol} is in {stock.currency}, not {item.currency}")

   
        if item.order_type == OrderType.market:
            executed_price_in_cents = int(stock.price_in_cents)
            limit_price_in_cents = None

  
        elif item.order_type == OrderType.limit:
            if item.limit_price_in_cents is None or item.limit_price_in_cents <= 0:
                raise ValueError("Limit order price must be greater than zero")
            limit_price_in_cents = item.limit_price_in_cents
            executed_price_in_cents = None  # Will execute later

        order_items.append({
            "stock": stock,
            "quantity": item.quantity,
            "order_type": item.order_type.value,
            "limit_price_in_cents": limit_price_in_cents,
            "executed_price_in_cents": executed_price_in_cents,
            "currency": item.currency.value,
            "status": OrderStatus.pending
        })

    return await create_order(user_id, order_items)

async def fetch_orders(user_id: int):
    return await get_orders_by_user(user_id)

async def fetch_order(order_id: int):
    return await get_order_by_id(order_id)