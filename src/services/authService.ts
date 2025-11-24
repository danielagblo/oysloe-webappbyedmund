import type { LoginRequest, LoginResponse, LogoutRequest, LogoutResponse, OTPLoginRequest, RegisterRequest, ResetPasswordRequest, ResetPasswordResponse } from "../types/Auth";
import { apiClient } from "./apiClient";

export const login = async (credentials: LoginRequest): Promise<LoginResponse> => {
	return apiClient.post<LoginResponse>(`/api-v1/login/`, credentials);
};

export const otpLogin = async (credentials: OTPLoginRequest): Promise<LoginResponse> => {
	return apiClient.post<LoginResponse>(`/api-v1/otplogin/`, credentials);
};

export const register = async (userData: RegisterRequest): Promise<LoginResponse> => {
	return apiClient.post<LoginResponse>(`/api-v1/register/`, userData);
};

export const resetPassword = async (data: ResetPasswordRequest): Promise<ResetPasswordResponse> => {
	return apiClient.post<ResetPasswordResponse>(`/api-v1/resetpassword/`, data);
};

export const logout = async (body: LogoutRequest = {}): Promise<LogoutResponse> => {
	return apiClient.post<LogoutResponse>(`/api-v1/logout/`, body);
};

export default {
	login,
	otpLogin,
	register,
	resetPassword,
	logout,
};
