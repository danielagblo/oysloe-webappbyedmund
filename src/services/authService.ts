import type {
  LoginRequest,
  LoginResponse,
  LogoutRequest,
  LogoutResponse,
  OTPLoginRequest,
  RegisterRequest,
  ResetPasswordRequest,
  ResetPasswordResponse,
} from "../types/Auth";
import { apiClient } from "./apiClient";

export const login = async (
  credentials: LoginRequest,
): Promise<LoginResponse> => {
  return apiClient.post<LoginResponse>(`/login/`, credentials);
};

export const otpLogin = async (
  credentials: OTPLoginRequest,
): Promise<LoginResponse> => {
  return apiClient.post<LoginResponse>(`/otplogin/`, credentials);
};

export const register = async (
  userData: RegisterRequest,
): Promise<LoginResponse> => {
  return apiClient.post<LoginResponse>(`/register/`, userData);
};

export const resetPassword = async (
  data: ResetPasswordRequest,
): Promise<ResetPasswordResponse> => {
  return apiClient.post<ResetPasswordResponse>(`/resetpassword/`, data);
};

export const logout = async (
  body: LogoutRequest = {},
): Promise<LogoutResponse> => {
  return apiClient.post<LogoutResponse>(`/logout/`, body);
};

export default {
  login,
  otpLogin,
  register,
  resetPassword,
  logout,
};
