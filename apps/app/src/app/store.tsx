import { configureStore } from '@reduxjs/toolkit';
import { stocksApi } from '@nx-react-python/stocks';

const store = configureStore({
  reducer: {
    [stocksApi.reducerPath]: stocksApi.reducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(stocksApi.middleware),
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
export default store;
