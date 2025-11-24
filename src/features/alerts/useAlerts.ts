import { useState, useEffect, useCallback } from "react";
import * as AlertsService from "../../services/alertService";
import { type Alert } from "../../types/Alert";

export function useAlerts() {
const [alerts, setAlerts] = useState<Alert[]>([]);
const [loading, setLoading] = useState<boolean>(false);
const [error, setError] = useState<string | null>(null);

const handleError = (err: unknown, fallbackMessage: string) => {
if (err instanceof Error) {
setError(err.message);
} else {
setError(fallbackMessage);
}
};

// Fetch all alerts
const fetchAlerts = useCallback(async () => {
setLoading(true);
setError(null);
try {
const data = await AlertsService.fetchAlerts();
setAlerts(data);
} catch (err: unknown) {
handleError(err, "Failed to fetch alerts");
} finally {
setLoading(false);
}
}, []);

// Create a new alert
const createAlert = useCallback(async (payload: Partial<Alert>) => {
setLoading(true);
setError(null);
try {
const newAlert = await AlertsService.createAlert(payload);
setAlerts(prev => [newAlert, ...prev]);
return newAlert;
} catch (err: unknown) {
handleError(err, "Failed to create alert");
throw err;
} finally {
setLoading(false);
}
}, []);

// Update an alert
const updateAlert = useCallback(async (id: number, payload: Partial<Alert>) => {
setLoading(true);
setError(null);
try {
const updatedAlert = await AlertsService.updateAlert(id, payload);
setAlerts(prev => prev.map(a => (a.id === id ? updatedAlert : a)));
return updatedAlert;
} catch (err: unknown) {
handleError(err, "Failed to update alert");
throw err;
} finally {
setLoading(false);
}
}, []);

// Delete an alert
const deleteAlert = useCallback(async (id: number) => {
setLoading(true);
setError(null);
try {
await AlertsService.deleteAlert(id);
setAlerts(prev => prev.filter(a => a.id !== id));
} catch (err: unknown) {
handleError(err, "Failed to delete alert");
throw err;
} finally {
setLoading(false);
}
}, []);

// Mark an alert as read
const markRead = useCallback(async (id: number) => {
setLoading(true);
setError(null);
try {
const updatedAlert = await AlertsService.markRead(id);
setAlerts(prev => prev.map(a => (a.id === id ? updatedAlert : a)));
return updatedAlert;
} catch (err: unknown) {
handleError(err, "Failed to mark alert as read");
throw err;
} finally {
setLoading(false);
}
}, []);

// Mark all alerts as read
const markAllRead = useCallback(async () => {
setLoading(true);
setError(null);
try {
const updatedAlerts = await AlertsService.markAllRead();
setAlerts(updatedAlerts);
return updatedAlerts;
} catch (err: unknown) {
handleError(err, "Failed to mark all alerts as read");
throw err;
} finally {
setLoading(false);
}
}, []);

useEffect(() => {
fetchAlerts();
}, [fetchAlerts]);

return {
alerts,
loading,
error,
fetchAlerts,
createAlert,
updateAlert,
deleteAlert,
markRead,
markAllRead,
};
}
