export interface IGovernorate {
  id: number;
  name: string;
  price: string;
}

export interface ICity {
  id: number;
  name: string;
}

export interface IGovernateAdmin {
  id: number;
  name: string;
  is_active: boolean;
  price: string;
  breakable_price: string | null;
}
