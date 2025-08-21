import { IProduct } from "./product";
import { UserRole } from "./user";

export interface IInventory {
  id: number;
  movement_date: Date;
  movement_type: "out" | "in";
  notes: string;
  product: IProduct;
  product_id: number;
  quantity: number;
  reference: string | null;
  user: { id: number; name: string; role: UserRole } | null;
  user_id: string | null;
  created_at: Date;
  updated_at: Date;
  available_quantity_before: number;
  available_quantity_after: number;
  stock_before: number;
  stock_after: number;
}
