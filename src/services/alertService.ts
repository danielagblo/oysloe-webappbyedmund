// // src/services/alertService.ts
// import { apiClient } from "./apiClient";
// import { endpoints } from "./endpoints";
// import mockAlertsRaw from "../assets/mocks/alerts.json";
// import { type Alert } from "../types/Alert";

// const useMocks = import.meta.env.VITE_USE_MOCKS === "true";

// const mockAlerts: Alert[] = mockAlertsRaw as Alert[];

// export async function listAlerts(): Promise<Alert[]> {
//   if (useMocks) return mockAlerts;
//   return apiClient.get<Alert[]>(endpoints.alerts.list());
// }

// export async function createAlert(payload: Partial<Alert>): Promise<Alert> {
//   if (useMocks) return { id: Date.now(), ...payload } as Alert;
//   return apiClient.post<Alert>(endpoints.alerts.create(), payload);
// }

// export async function retrieveAlert(id: number): Promise<Alert | undefined> {
//   if (useMocks) return mockAlerts.find(a => a.id === id);
//   return apiClient.get<Alert>(endpoints.alerts.retrieve(id));
// }

// export async function updateAlert(id: number, payload: Partial<Alert>): Promise<Alert> {
//   if (useMocks) return { ...mockAlerts.find(a => a.id === id), ...payload } as Alert;
//   return apiClient.patch<Alert>(endpoints.alerts.update(id), payload); // patch instead of put
// }

// export async function destroyAlert(id: number): Promise<void> {
//   if (useMocks) return;
//   return apiClient.delete(endpoints.alerts.destroy(id));
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
