import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { Stock } from '../types/stockType';

interface StocksState {
  stocks: Stock[];
}

const initialState: StocksState = {
  stocks: [],
};

const stocksSlice = createSlice({
  name: 'stocks',
  initialState,
  reducers: {
    setStocks: (state, action: PayloadAction<Stock[]>) => {
      state.stocks = action.payload;
    },
    updateStockPrice: (
      state,
      action: PayloadAction<{ symbol: string; newPrice: number }>
    ) => {
      const stock = state.stocks.find(
        (s) => s.symbol === action.payload.symbol
      );
      if (stock) {
        stock.price = action.payload.newPrice;
      }
    },
  },
});

export const { setStocks, updateStockPrice } = stocksSlice.actions;
export default stocksSlice.reducer;
