import { Money } from '@nx-react-python/shared';

export interface Stock {
  id: string;
  symbol: string;
  name: string;
  price: Money;
  price_last_updated: string;
  logo_url: string;
}

export interface BuyStockPayload {
  user_id: number;
  items: {
    stock_symbol: string;
    quantity: number;
    order_type: OrderType;
    limit_price_in_cents: number | null | undefined;
  }[];
}

export enum OrderType {
  Market = 'market',
  Limit = 'limit',
}
