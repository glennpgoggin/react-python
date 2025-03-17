// import { mockBaseQuery } from '@nx-react-python/shared';
import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import { CreateOrderPayload } from '../types/orderTypes';
import { BASE_API_URL } from '../config';
import { Order } from '@nx-react-python/shared';

export const ordersApi = createApi({
  reducerPath: 'ordersApi',
  baseQuery: fetchBaseQuery({ baseUrl: BASE_API_URL }),
  // baseQuery: mockBaseQuery(BASE_API_URL),
  endpoints: (builder) => ({
    getOrders: builder.query<Order[], void>({
      query: () => `/orders`,
    }),
    createOrder: builder.mutation<
      { success: boolean },
      { payload: CreateOrderPayload }
    >({
      query: ({ payload }) => ({
        url: `/orders`,
        method: 'POST',
        body: payload,
      }),
    }),
  }),
});

export const { useGetOrdersQuery, useCreateOrderMutation } = ordersApi;
