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
import { endpoints } from "./endpoints";

export const login = async (
  credentials: LoginRequest,
): Promise<LoginResponse> => {
  return apiClient.post<LoginResponse>(endpoints.auth.login(), credentials);
};

export const otpLogin = async (
  credentials: OTPLoginRequest,
): Promise<LoginResponse> => {
  return apiClient.post<LoginResponse>(endpoints.auth.otpLogin(), credentials);
};

export const register = async (
  userData: RegisterRequest,
): Promise<LoginResponse> => {
  return apiClient.post<LoginResponse>(endpoints.auth.register(), userData);
};

export const resetPassword = async (
  data: ResetPasswordRequest,
  headers?: Record<string, string>,
): Promise<ResetPasswordResponse> => {
  return apiClient.post<ResetPasswordResponse>(
    endpoints.auth.resetPassword(),
    data,
    headers,
  );
};

export const logout = async (
  body: LogoutRequest = {},
): Promise<LogoutResponse> => {
  return apiClient.post<LogoutResponse>(endpoints.auth.logout(), body);
};

export default {
  login,
  otpLogin,
  register,
  resetPassword,
  logout,
};
