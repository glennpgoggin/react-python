import { configureStore } from '@reduxjs/toolkit';
import { stocksApi } from '@nx-react-python/stocks';
import { ordersApi } from '@nx-react-python/orders';

const store = configureStore({
  reducer: {
    [stocksApi.reducerPath]: stocksApi.reducer,
    [ordersApi.reducerPath]: ordersApi.reducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat([stocksApi.middleware, ordersApi.middleware]),
});

export type AppDispatch = typeof store.dispatch;
export type RootState = ReturnType<typeof store.getState>;

export default store;
