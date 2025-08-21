import { PaginationOptions } from ".";

export interface IProduct {
  id: number;
  name: string;
  description: string | null;
  price: string;
  price_before_discount: string;
  stock: number;
  available_stock: number;
  image: string;
  category_id: number;
  category: { id: number; name: string };
  year: string;
  semester: string;
  priority: number;
  is_best_seller: number;
  product_type: string;
  created_at: string;
  updated_at: string;
  is_favorite: boolean;
  in_stock: number;
  offer: {
    id: number;
    product_id: number;
    title: string;
    description: string;
    created_at: Date;
    end_date: string;
    new_price: number;
  } | null;
  max_quantity_per_order: number | null;
  is_breakable: boolean;
  is_active: boolean;
}

export interface CreateProductDto {
  name: string;
  description: string | null;
  price: string;
  category_id: number;
  year: number;
  semester: number;

  stock: number;
  available_stock: number;

  priority: number;
  is_best_seller: number;

  image: File;
}

export interface ProductFilterOptions extends PaginationOptions {
  year?: string;
  category_id?: string;
  price?: string;
}

export interface IFeaturedProduct {
  id: number;
  name: string;
  image: string;
  stock: number;
  available_stock: number;
  discount_percentage: string;
  in_stock: number;
  is_favorite: boolean;
}
