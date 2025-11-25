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

//import { apiClient } from "./apiClient";
// import { endpoints } from "./endpoints";
// import mockAlertsRaw from "../assets/mocks/alerts.json";
// import { type Alert } from "../types/Alert";

// const useMocks = import.meta.env.VITE_USE_MOCKS === "true";

// const mockAlerts: Alert[] = mockAlertsRaw as Alert[];

// export async function fetchAlerts(): Promise<Alert[]> {
//   if (useMocks) return mockAlerts;
//   return apiClient.get<Alert[]>(endpoints.alerts.list());
// }

// export async function createAlert(payload: Partial<Alert>): Promise<Alert> {
//   if (useMocks) return { id: Date.now(), ...payload } as Alert;
//   return apiClient.post<Alert>(endpoints.alerts.create(), payload);
// }

// export async function fetchAlert(id: number): Promise<Alert | undefined> {
//   if (useMocks) return mockAlerts.find(a => a.id === id);
//   return apiClient.get<Alert>(endpoints.alerts.retrieve(id));
// }

// export async function updateAlert(id: number, payload: Partial<Alert>): Promise<Alert> {
//   if (useMocks) return { ...mockAlerts.find(a => a.id === id), ...payload } as Alert;
//   return apiClient.patch<Alert>(endpoints.alerts.update(id), payload); // patch instead of put
// }

// export async function deleteAlert(id: number): Promise<void> {
//   if (useMocks) return;
//   return apiClient.delete(endpoints.alerts.delete(id));
// }

// export async function markRead(id: number): Promise<Alert> {
//   if (useMocks) {
//     const alert = mockAlerts.find(a => a.id === id);
//     if (alert) alert.is_read = true;
//     return alert as Alert;
//   }
//   return apiClient.post<Alert>(endpoints.alerts.markRead(id), {});
// }

// export async function markAllRead(): Promise<Alert[]> {
//   if (useMocks) return mockAlerts.map(a => ({ ...a, is_read: true }));
//   return apiClient.post<Alert[]>(endpoints.alerts.markAllRead(), {});
// }

