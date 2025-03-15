import { configureStore } from '@reduxjs/toolkit';
// import { createStocksApi, a} from '@nx-react-python/stocks';

// const apiUrl = '';
// const stocksApi = createStocksApi(apiUrl);

const store = configureStore({
  reducer: {
    // [stocksApi.reducerPath]: stocksApi.reducer,
  },
  // middleware: (getDefaultMiddleware) =>
  //   getDefaultMiddleware().concat(stocksApi.middleware),
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
export default store;
