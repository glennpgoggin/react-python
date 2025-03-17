from fastapi import APIRouter, HTTPException
from .service import list_stocks, get_stock_details, add_stock, modify_stock, remove_stock, fetch_nbbo_price
from .schemas import StockSchema, StockCreateSchema, StockUpdateSchema
from typing import List

router = APIRouter(prefix="/stocks", tags=["stocks"])

@router.get("/", response_model=List[StockSchema])
async def get_stocks():
    return await list_stocks()

@router.get("/{symbol}", response_model=StockSchema)
async def get_stock(symbol: str):
    return await get_stock_details(symbol)

@router.get("/{symbol}/nbbo")
async def get_nbbo(symbol: str):
    nbbo_data = await fetch_nbbo_price(symbol)
    if not nbbo_data:
        raise HTTPException(status_code=404, detail=f"NBBO data not found for {symbol}")
    return nbbo_data

@router.post("/", response_model=StockSchema, status_code=201)
async def create_stock(stock_data: StockCreateSchema):
    try:
        return await add_stock(stock_data.symbol, stock_data.name, stock_data.price_in_cents,stock_data.currency, stock_data.logo_url)
    except ValueError as e:
        raise HTTPException(status_code=400, detail=str(e))


@router.put("/{symbol}", response_model=StockSchema)
async def update_stock(symbol: str, stock_data: StockUpdateSchema):
    try:
        return await modify_stock(symbol, stock_data.name, stock_data.price_in_cents, stock_data.currency,stock_data.logo_url)
    except ValueError as e:
        raise HTTPException(status_code=404, detail=str(e))


@router.delete("/{symbol}", status_code=204)
async def delete_stock(symbol: str):
    try:
        return await remove_stock(symbol)
    except ValueError as e:
        raise HTTPException(status_code=404, detail=str(e))

