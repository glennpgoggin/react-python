export interface Stock {
  id: string;
  symbol: string;
  name: string;
  price: number;
  logo_url: string;
}

export interface BuyStockPayload {
  symbol: string;
  quantity: number;
  order_type: OrderType;
  price: number;
}

export enum OrderType {
  Market = 'market',
  Limit = 'limit',
}
