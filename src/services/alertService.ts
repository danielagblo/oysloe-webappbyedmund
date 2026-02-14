import type { Alert } from "../types/Alert";
import { apiClient } from "./apiClient";
import { endpoints } from "./endpoints";


export const getAlerts = async (params?: {
  ordering?: string;
  search?: string;
}): Promise<Alert[]> => {

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
  return apiClient.get<Alert>(endpoints.alerts.retrieve(id));
};

export const createAlert = async (body: Partial<Alert>): Promise<Alert> => {
  return apiClient.post<Alert>(endpoints.alerts.create(), body);
};

export const updateAlert = async (
  id: number,
  body: Partial<Alert>,
): Promise<Alert> => {
  return apiClient.patch<Alert>(endpoints.alerts.update(id), body);
};

export const deleteAlert = async (id: number): Promise<void> => {
  return apiClient.delete(endpoints.alerts.delete(id));
};

export const markAlertRead = async (id: number): Promise<Alert> => {
  return apiClient.post<Alert>(endpoints.alerts.markRead(id), {});
};

export const markAllAlertsRead = async (): Promise<Alert[]> => {
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
