export interface UpdateDeliveryDto {
  phone: string;
  alternative_phone: string;
  address: string;
  city_id: number;
  governorate_id: number;
}

export interface RegisterUserDto {
  name: string;
  password: string;
  phone: string;
  alternative_phone: string;
  year: string;
  address?: string;
  city?: string;
  governorate?: string;
  role: "user" | "admin";
  device_name: string;
}

export interface LoginUserDto {
  login: string;
  password: string;
}

export type UserRole = "user" | "admin";

export interface IUser {
  id: number;
  address: string;
  alternative_phone: string;
  email_verified_at: Date | null;
  year: number | null;
  city_id: number;
  governorate_id: number;
  name: string;
  phone: string;
  role: UserRole;
  created_at: Date;
  updated_at: Date;
}

export interface IAuthState {
  user: IUser | null;
  token: string | null;
}

export interface UpdateUserProfileDto {
  name: string;
  password: string;
  password_confirmation: string;
  alternative_phone: string;
}
