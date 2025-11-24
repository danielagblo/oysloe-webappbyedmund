import type { Alert } from "../types/Alert";
import { apiClient } from "./apiClient";

export const getAlerts = async (params?: { ordering?: string; search?: string }): Promise<Alert[]> => {
	const qs = new URLSearchParams();
	if (params?.ordering) qs.append("ordering", params.ordering);
	if (params?.search) qs.append("search", params.search);

	const query = qs.toString() ? `?${qs.toString()}` : "";
	return apiClient.get<Alert[]>(`/api-v1/alerts/${query}`);
};

export const getAlert = async (id: number): Promise<Alert> => {
	return apiClient.get<Alert>(`/api-v1/alerts/${id}/`);
};

// Mark a single alert as read (server may accept partial Alert payload)
export const markAlertRead = async (id: number, body: Partial<Alert> = {}): Promise<Alert> => {
	return apiClient.post<Alert>(`/api-v1/alerts/${id}/mark-read/`, body);
};

// Mark all alerts as read; body is optional and depends on backend behavior
export const markAllAlertsRead = async (body: Partial<Alert> = {}): Promise<void> => {
	await apiClient.post<void>(`/api-v1/alerts/mark-all-read/`, body);
};

export const createAlert = async (body: Partial<Alert>): Promise<Alert> => {
	return apiClient.post<Alert>(`/api-v1/alerts/`, body);
};

export default {
	getAlerts,
	getAlert,
	markAlertRead,
	markAllAlertsRead,
	createAlert,
};

