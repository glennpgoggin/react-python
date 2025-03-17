from fastapi import APIRouter, WebSocket, WebSocketDisconnect
import asyncio
import random
from datetime import datetime
from api.stocks.repository import get_stock_by_symbol

router = APIRouter()

# Store connected WebSockets per stock symbol
active_connections = {}

async def send_price_updates(symbol: str):
    """Simulates price updates for a stock and sends updates to subscribers."""
    while True:
        if symbol not in active_connections or not active_connections[symbol]:
            await asyncio.sleep(1)  # If no subscribers, sleep and check again
            continue

        stock = await get_stock_by_symbol(symbol)
        if not stock:
            continue  

        # Simulate price fluctuation (+/- 5%)
        price_change = stock.price_in_cents * (random.uniform(-0.05, 0.05))
        new_price_in_cents = max(1, int(stock.price_in_cents + price_change))  # Avoid negative prices

      
        message = {
            "symbol": symbol,
            "price": {
                "amount_in_cents": new_price_in_cents,
                "amount": new_price_in_cents / 100,
                "currency": stock.currency,
                "formatted": f"${new_price_in_cents / 100:.2f}",
            },
            "price_last_updated_at": datetime.utcnow().isoformat(),
        }

      
        for websocket in active_connections[symbol]:
            await websocket.send_json(message)

        await asyncio.sleep(10)  

@router.websocket("/stocks/{symbol}/ws")
async def stock_price_websocket(websocket: WebSocket, symbol: str):
    """Handles WebSocket connections for stock price updates."""
    await websocket.accept()
    
    if symbol not in active_connections:
        active_connections[symbol] = []

    active_connections[symbol].append(websocket)


    if len(active_connections[symbol]) == 1:
        asyncio.create_task(send_price_updates(symbol))

    try:
        while True:
            await websocket.receive_text()  
    except WebSocketDisconnect:
        active_connections[symbol].remove(websocket)
        if not active_connections[symbol]:  
            del active_connections[symbol]
