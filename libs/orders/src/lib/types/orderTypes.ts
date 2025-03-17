import { OrderType } from '@nx-react-python/shared';

export interface CreateOrderPayload {
  user_id: number;
  items: {
    stock_symbol: string;
    quantity: number;
    order_type: OrderType;
    limit_price_in_cents: number | null | undefined;
  }[];
}
