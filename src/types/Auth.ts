export interface AuthUser {
  id: number;
  active_ads: number;
  taken_ads: number;
  last_login: string;
  created_at: string;
  updated_at: string;
  email: string;
  phone?: string;
  name?: string;
  business_name?: string;
  id_number?: string;
  second_number?: string;
  business_logo?: string;
  id_front_page?: string;
  id_back_page?: string;
  account_number?: string;
  account_name?: string;
  mobile_network?: string;
  address?: string;
  avatar?: string;
  admin_verified: boolean;
  deleted: boolean;
  level: string;
  referral_points: number;
  referral_code?: string;
  is_active: boolean;
  is_staff: boolean;
  is_superuser: boolean;
  created_from_app: boolean;
  phone_verified: boolean;
  email_verified: boolean;
  preferred_notification_email?: string;
  preferred_notification_phone?: string;
}

export interface LoginResponse {
  user: AuthUser;
  token: string;
}

export interface LoginRequest {
  email: string;
  password: string;
}

export interface LogoutResponse {
  status: string;
  message: string;
}

export interface LogoutRequest {
  status?: string;
  message?: string;
}

export interface OTPLoginRequest {
  phone: string;
  otp: string;
}

export interface RegisterRequest {
  email: string;
  phone: string;
  password: string;
  name?: string;
  address?: string;
  referral_code?: string;
}

export interface ResetPasswordRequest {
  phone: string;
  new_password: string;
  confirm_password: string;
}

export interface ResetPasswordResponse {
  status: string;
  message: string;
}
