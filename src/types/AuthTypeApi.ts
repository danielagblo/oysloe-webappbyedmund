/* -- Registration -- */
export interface RegisterUserRequest {
  email: string;
  phone: string;
  password: string;
  name: string;
  address?: string;
  referral_code?: string;
}

export type LevelEnum = "SILVER" | "GOLD" | "DIAMOND";

export interface User {
  id: number;
  last_login: string;
  created_at: string;
  updated_at: string;
  email: string;
  phone: string;
  name: string;
  address: string;
  avatar: string;
  deleted: boolean;
  level: LevelEnum;
  referral_points: number;
  referral_code: string;
  is_active: boolean;
  is_staff: boolean;
  is_superuser: boolean;
  created_from_app: boolean;
  phone_verified: boolean;
  email_verified: boolean;
  preferred_notification_email: string;
  preferred_notification_phone: string;
  token?: string;
}

export interface RegisterUser {
  user: User;
  token: string;
}

export type RegisterUserResponse = RegisterUser | GenericMessage;

/* -- Login -- */
export interface LoginRequest {
  email: string;
  password: string;
}

export interface LoginUser {
  user: User;
  token: string;
}

export interface GenericMessage {
  message: string;
}

export interface LogoutRequest {
  User: User;
  // token: string;
}

export type LoginResponse = LoginUser | GenericMessage;

export interface SimpleStatusResponse {
  status: string;
  message: string;
}

/* -- OTP Login -- */
export interface VerifyOTPRequest {
  phone: string;
  otp: string;
}

export type VerifyOTPResponse = LoginUser | GenericMessage;

/* -- Reset Password -- */
export interface ResetPasswordRequest {
  new_password: string;
  confirm_password: string;
  token: string;
}

export interface ChangePasswordRequest {
  old_password: string;
  new_password: string;
  confirm_password: string;
}

export type SimpleStatusGenericMessage = GenericMessage | SimpleStatusResponse;

/* -- Profile Data -- */
