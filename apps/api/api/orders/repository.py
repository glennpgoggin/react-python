from api.orders.models import Order, OrderItem, OrderStatus
from api.orders.schemas import OrderSchema
from typing import List
from tortoise.transactions import in_transaction

async def create_order(user_id: int, items: List[dict]) -> OrderSchema:
    async with in_transaction():
        order = await Order.create(user_id=user_id, status=OrderStatus.pending)

        for item in items:
            await OrderItem.create(
                order=order,
                stock=item["stock"],
                quantity=item["quantity"],
                order_type=item["order_type"],
                limit_price_in_cents=item["limit_price_in_cents"],
                executed_price_in_cents=item["executed_price_in_cents"],
                currency=item["currency"],
                status=OrderStatus.pending
            )
        return await get_order_by_id(order.id)

async def get_order_by_id(order_id: int):
    return await Order.filter(id=order_id).prefetch_related("items").prefetch_related("items__stock").first()

async def get_orders_by_user(user_id: int):
    return await Order.filter(user_id=user_id).prefetch_related("items").prefetch_related("items__stock").all()
