import { mockBaseQuery } from '@nx-react-python/shared';
import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import { BuyStockPayload, Stock } from '../types/stockTypes';
import { BASE_API_URL } from '../config';

export const stocksApi = createApi({
  reducerPath: 'stocksApi',
  // baseQuery: fetchBaseQuery({ baseUrl: BASE_API_URL }),
  baseQuery: mockBaseQuery(BASE_API_URL),
  endpoints: (builder) => ({
    getStocks: builder.query<Stock[], void>({
      query: () => `/stocks`,
    }),
    getStockBySymbol: builder.query<Stock, string>({
      query: (symbol) => `/stocks/${symbol}`,
    }),
    getNBBOPrice: builder.query<{ bid: number; ask: number }, string>({
      query: (symbol) => `/stocks/${symbol}/nbbo`,
      keepUnusedDataFor: 5,
    }),
    buyStock: builder.mutation<
      { success: boolean },
      { payload: BuyStockPayload }
    >({
      query: ({ payload }) => ({
        url: `/stocks/${payload.symbol}/buy`,
        method: 'POST',
        body: payload,
      }),
    }),
  }),
});

export const {
  useGetStocksQuery,
  useGetStockBySymbolQuery,
  useGetNBBOPriceQuery,
  useBuyStockMutation,
} = stocksApi;
