import { IProduct } from "./product";
import { IUser } from "./user";

export type OrderStatusEnum = "pending" | "confirmed" | "shipped" | "cancelled";
export type OrderPaymentStatusEnum = "paid" | "pending" | "expired";

/**
 * Interface representing a complete order in the system
 */
export interface IOrder {
  id: number;
  user_id: number;
  user: IUser;

  // Order items and pricing
  order_items: IOrderItem[];
  total_price: string;

  // Delivery information
  customer_delivery_price: string;
  delivery_status: null;
  tracking_number: null;
  tracking_url: null;

  // Invoice information
  invoice_id: string;
  invoice_key: string;
  invoice_provider: string;
  invoice_url: string;

  // Status information
  order_status: OrderStatusEnum;
  invoice_status: OrderPaymentStatusEnum;

  // Timestamps
  created_at: Date;
  updated_at: Date;
  payment_time: Date | null;
}

/**
 * Interface representing an individual item within an order
 */
export interface IOrderItem {
  id: number;
  order_id: number;
  product_id: number;
  product: IProduct;

  // Pricing and quantity
  price: string;
  quantity: number;
  total_price: string;

  // Timestamps
  created_at: Date;
  updated_at: Date;
}

/**
 * Data transfer object for updating an order's status
 */
export interface UpdateOrderDto {
  id: number;
  order_status: OrderStatusEnum;
  tracking_url?: string;
  tracking_number?: string;
}

export interface IPivot {
  pivot: {
    order_id: number;
    product_id: number;
    quantity: number;
    price: string;
    total_price: string;
    created_at: Date;
    updated_at: Date;
  };
}

export interface IUserOrder {
  id: 7;
  user_id: 20;
  invoice_status: OrderPaymentStatusEnum;
  order_status: OrderStatusEnum;
  invoice_provider: string;
  delivery_status: string | null;
  total_price: string;
  customer_delivery_price: string;
  tracking_url: string | null;
  tracking_number: string | null;
  payment_time: string | null;
  invoice_key: string;
  invoice_id: string;
  invoice_url: string;
  created_at: Date;
  updated_at: Date;
  products: (IProduct & IPivot)[];
}
