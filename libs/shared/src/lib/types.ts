export enum Currency {
  USD = 'USD',
}
export interface Money {
  amount_in_cents: number;
  amount: number;
  currency: Currency;
  formatted: string;
}

export interface Stock {
  id: string;
  symbol: string;
  name: string;
  price: Money;
  price_last_updated: string;
  logo_url: string;
}

export enum OrderType {
  Market = 'market',
  Limit = 'limit',
}

export enum OrderStatus {
  Pending = 'pending',
  Complete = 'complete',
}

export interface Order {
  id: string;
  status: OrderStatus;
  items: OrderItem[];
  created_at: string;
}

export interface OrderItem {
  id: string;
  stock: Stock;
  quantity: number;
  status: OrderStatus;
  order_type: OrderType;
  limit_price: Money | null | undefined;
  executed_price: Money | null | undefined;
  created_at: string;
}
