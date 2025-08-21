import { IProduct } from "./product";

export interface IOffer {
  id: number;
  title: string;
  description: string;
  start_date: Date;
  end_date: Date;
  new_price: number;
  image: string;
  product: IProduct;
  product_id: number;
}

export interface IPublicOffer {}

export interface IPopupOffer {
  id: number;
  product_id: number;
  product_name: string;
  product_price: string;
  new_price: number;
  title: string;
  description: string;
  start_date: Date;
  end_date: Date;
  image_url: string;
}

export interface IPopup {
  is_active: boolean;
  offer: IPopupOffer;
  popup_image: string;
}
