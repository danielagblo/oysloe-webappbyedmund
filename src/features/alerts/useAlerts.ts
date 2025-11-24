import { useState, useEffect, useCallback } from "react";
import type { Alert } from "../../types/Alert";

import {
  getAlerts,
  getAlert,
  createAlert,
  markAlertRead,
  markAllAlertsRead,
} from "../../services/alertService";

export function useAlerts() {
  const [alerts, setAlerts] = useState<Alert[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const fetchAlerts = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      const data = await getAlerts();
      setAlerts(data);
    } catch {
      setError("Failed to load alerts");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchAlerts();
  }, [fetchAlerts]);

  const fetchAlert = useCallback(async (id: number) => {
    try {
      return await getAlert(id);
    } catch {
      setError("Failed to retrieve alert");
      return undefined;
    }
  }, []);

  const markRead = useCallback(async (id: number) => {
    try {
      const updated = await markAlertRead(id);

      setAlerts((prev) =>
        prev.map((a) => (a.id === id ? updated : a))
      );
    } catch {
      setError("Failed to mark alert as read");
    }
  }, []);

  const markAllRead = useCallback(async () => {
    try {
      await markAllAlertsRead();

      setAlerts((prev) =>
        prev.map((a) => ({ ...a, is_read: true }))
      );
    } catch {
      setError("Failed to mark all alerts as read");
    }
  }, []);

  const addAlert = useCallback(async (body: Partial<Alert>) => {
    try {
      const newAlert = await createAlert(body);
      setAlerts((prev) => [newAlert, ...prev]);
      return newAlert;
    } catch {
      setError("Failed to create alert");
      return undefined;
    }
  }, []);

  return {
    alerts,
    loading,
    error,

    fetchAlerts,
    fetchAlert,
    addAlert,
    markRead,
    markAllRead,
  };
}
