import { IProduct } from "./product";

export interface ICart {
  coupon_warning: string | null;
  discount_amount: number | null;
  discount_percentage: string | null;
  price_after_discount: number;
  price_without_shipping: number; 
  shipping_cost: number;
  total_price: number;
  cart_items: ICartItem[];
}

export interface ICartItem {
  id: number;
  user_id: number;
  product_id: number;
  quantity: number;
  price: string;
  created_at: Date;
  updated_at: Date;
  product: IProduct;
}

export interface InvoiceResponse {
  discount: number;
  invoice_id: number;
  invoice_key: string;
  invoice_url: string;
  order_id: number;
  shipping_cost: number;
  total_price: number;
}

export interface ICouponeResponse {
  discount_amount: number;
  discount_percentage: string;
  original_price: number;
  price_after_discount: number;
  shipping_cost: number;
  total_with_shipping: number;
}
