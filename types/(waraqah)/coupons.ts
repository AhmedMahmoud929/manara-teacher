export interface ICoupon {
  id: number;
  code: string;
  created_at: Date;
  discount_percentage: string;
  updated_at: Date;
  valid_from: string;
  valid_to: string;

  usage_limit: number;
  per_user_limit: number;
  available_usage: string;
}

export interface CreateCouponDto {
  code: string;
  discount_percentage: number;
  description: string;
  valid_from: string;
  valid_to: string;
  usage_limit: number;
  per_user_limit: number;
}

export interface UpdateCouponDto extends Partial<CreateCouponDto> {
  id: number;
}
