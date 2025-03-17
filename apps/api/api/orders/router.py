from fastapi import APIRouter, HTTPException
from .service import buy_stock, fetch_orders, fetch_order
from .schemas import OrderCreateSchema, OrderSchema
from typing import List

router = APIRouter(prefix="/orders", tags=["orders"])

@router.post("", response_model=OrderSchema, status_code=201)
async def create_order(order_data: OrderCreateSchema):
    try:
        return await buy_stock(order_data.user_id, order_data.items)
    
    except ValueError as e:
        raise HTTPException(status_code=400, detail=str(e))

@router.get("", response_model=List[OrderSchema])
async def get_orders():
    user_id = 1
    return await fetch_orders(user_id)


@router.get("/{order_id}", response_model=OrderSchema)
async def get_order(order_id: int):
    return await fetch_order(order_id)
