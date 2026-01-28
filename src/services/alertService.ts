import mockAlertsRaw from "../assets/mocks/alerts.json";
import type { Alert } from "../types/Alert";
import { apiClient } from "./apiClient";
import { endpoints } from "./endpoints";

const useMocks = import.meta.env.VITE_USE_MOCKS === "true";
const mockAlerts: Alert[] = mockAlertsRaw as Alert[];

export const getAlerts = async (params?: {
  ordering?: string;
  search?: string;
}): Promise<Alert[]> => {
  if (useMocks) return mockAlerts;

  const qs = new URLSearchParams();
  if (params?.ordering) qs.append("ordering", params.ordering);
  if (params?.search) qs.append("search", params.search);

  const query = qs.toString() ? `?${qs.toString()}` : "";
  const result = await apiClient.get<Alert[]>(
    `${endpoints.alerts.list()}${query}`,
  );
  return result || [];
};

export const getAlert = async (id: number): Promise<Alert> => {
  if (useMocks) return mockAlerts.find((a) => a.id === id)!;
  return apiClient.get<Alert>(endpoints.alerts.retrieve(id));
};

export const createAlert = async (body: Partial<Alert>): Promise<Alert> => {
  if (useMocks) return { id: Date.now(), ...body } as Alert;
  return apiClient.post<Alert>(endpoints.alerts.create(), body);
};

export const updateAlert = async (
  id: number,
  body: Partial<Alert>,
): Promise<Alert> => {
  if (useMocks) {
    const existing = mockAlerts.find((a) => a.id === id);
    return { ...existing, ...body } as Alert;
  }
  return apiClient.patch<Alert>(endpoints.alerts.update(id), body);
};

export const deleteAlert = async (id: number): Promise<void> => {
  if (useMocks) return;
  return apiClient.delete(endpoints.alerts.delete(id));
};

export const markAlertRead = async (id: number): Promise<Alert> => {
  if (useMocks) {
    const alert = mockAlerts.find((a) => a.id === id);
    if (alert) alert.is_read = true;
    return alert as Alert;
  }
  return apiClient.post<Alert>(endpoints.alerts.markRead(id), {});
};

export const markAllAlertsRead = async (): Promise<Alert[]> => {
  if (useMocks) return mockAlerts.map((a) => ({ ...a, is_read: true }));
  return apiClient.post<Alert[]>(endpoints.alerts.markAllRead(), {});
};

export default {
  getAlerts,
  getAlert,
  createAlert,
  updateAlert,
  deleteAlert,
  markAlertRead,
  markAllAlertsRead,
};
