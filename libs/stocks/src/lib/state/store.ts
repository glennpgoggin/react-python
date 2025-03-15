import { configureStore } from '@reduxjs/toolkit';
import { stocksApi } from '../api/stocksApi';

export const store = configureStore({
  reducer: {
    [stocksApi.reducerPath]: stocksApi.reducer, // Add RTK Query reducer
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(stocksApi.middleware), // Add RTK Query middleware
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
