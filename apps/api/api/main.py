from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from api.database import init_db
from api.stocks.router import router as stocks_router  
from api.stocks.websockets import router as stock_ws_router
from api.orders.router import router as orders_router
from api.users import router as users_router

app = FastAPI(
    title="Stocks Trading API",
    description="A FastAPI backend for a stock trading platform.",
    version="1.0.0"
)

init_db(app)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)
app.include_router(users_router,  prefix="/v1")  
app.include_router(stocks_router,  prefix="/v1")  
app.include_router(stock_ws_router)
app.include_router(orders_router,  prefix="/v1")  

@app.get("/")
def root():
    return {"message": "Welcome to the Stocks API"}
