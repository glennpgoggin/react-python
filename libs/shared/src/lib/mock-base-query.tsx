import { fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import type {
  BaseQueryFn,
  FetchArgs,
  FetchBaseQueryError,
} from '@reduxjs/toolkit/query';

export const mockStocks = [
  {
    id: '1',
    symbol: 'AAPL',
    name: 'Apple Inc.',
    price: 175.32,
    logo_url: 'https://logo.clearbit.com/apple.com',
  },
  {
    id: '2',
    symbol: 'TSLA',
    name: 'Tesla Inc.',
    price: 910.45,
    logo_url: 'https://logo.clearbit.com/tesla.com',
  },
  {
    id: '3',
    symbol: 'AMZN',
    name: 'Amazon Inc.',
    price: 3254.76,
    logo_url: 'https://logo.clearbit.com/amazon.com',
  },
  {
    id: '4',
    symbol: 'MSFT',
    name: 'Microsoft Corporation',
    price: 299.57,
    logo_url: 'https://logo.clearbit.com/microsoft.com',
  },
  {
    id: '5',
    symbol: 'GOOGL',
    name: 'Alphabet Inc. (Google)',
    price: 2750.1,
    logo_url: 'https://logo.clearbit.com/google.com',
  },
  {
    id: '6',
    symbol: 'NVDA',
    name: 'NVIDIA Corporation',
    price: 215.32,
    logo_url: 'https://logo.clearbit.com/nvidia.com',
  },
  {
    id: '7',
    symbol: 'META',
    name: 'Meta Platforms Inc. (Facebook)',
    price: 336.12,
    logo_url: 'https://logo.clearbit.com/meta.com',
  },
  {
    id: '8',
    symbol: 'NFLX',
    name: 'Netflix Inc.',
    price: 590.45,
    logo_url: 'https://logo.clearbit.com/netflix.com',
  },
];

// Mocked responses for specific endpoints
const mockResponses: Record<string, any> = {
  '/stocks': mockStocks,
  '/stocks/AAPL': mockStocks[0],
  '/stocks/TSLA': mockStocks[1],

  '/stocks/AAPL/buy': {
    success: true,
  },
  '/stocks/AAPL/nbbo': {
    symbol: 'AAPL',
    bid: 175.32,
    ask: 175.36,
    bidSize: 1200,
    askSize: 950,
    timestamp: '2025-03-14T15:00:02Z',
  },
};

const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

export const mockBaseQuery = (
  baseUrl: string
): BaseQueryFn<string | FetchArgs, unknown, FetchBaseQueryError> => {
  const baseQuery = fetchBaseQuery({ baseUrl });

  return async (args, api, extraOptions) => {
    const url = typeof args === 'string' ? args : args.url;

    // Check for mock responses
    if (url && mockResponses[url]) {
      console.log(`[Mock] Returning mock data for ${url}`);
      await delay(4000);
      return { data: mockResponses[url] };
    }

    const modifiedArgs =
      typeof args === 'string'
        ? { url }
        : {
            ...args,
          };

    const result = await baseQuery(modifiedArgs, api, extraOptions);

    if (result.error) {
      console.error(`[Error] ${result.error.status}: ${url}`, result.error);
    }

    return result;
  };
};
