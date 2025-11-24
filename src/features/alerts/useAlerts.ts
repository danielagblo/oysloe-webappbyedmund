import { useState, useEffect, useCallback } from "react";
import type { Alert } from "../../types/Alert";
import {
  listAlerts,
  createAlert,
  retrieveAlert,
  updateAlert,
  destroyAlert,
  markRead as serviceMarkRead,
  markAllRead as serviceMarkAllRead,
} from "../../services/alertService";

export function useAlerts() {
  const [alerts, setAlerts] = useState<Alert[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  /** Fetch all alerts */
  const fetchAlerts = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await listAlerts();
      setAlerts(data);
    } catch (err) {
      console.log(err);
      setError("Failed to load alerts");
    } finally {
      setLoading(false);
    }
  }, []);

  /** Create alert */
  const addAlert = useCallback(async (payload: Partial<Alert>) => {
    try {
      const created = await createAlert(payload);
      setAlerts(prev => [created, ...prev]);
      return created;
    } catch (err) {
      setError("Failed to create alert");
      throw err;
    }
  }, []);

  /** Retrieve one alert */
  const getAlert = useCallback(async (id: number) => {
    try {
      return await retrieveAlert(id);
    } catch (err) {
      console.log(err);
      setError("Failed to retrieve alert");
      return undefined;
    }
  }, []);

  /** Update alert */
  const editAlert = useCallback(async (id: number, payload: Partial<Alert>) => {
    try {
      const updated = await updateAlert(id, payload);
      setAlerts(prev =>
        prev.map(a => (a.id === id ? updated : a))
      );
      return updated;
    } catch (err) {
      setError("Failed to update alert");
      throw err;
    }
  }, []);

  /** Delete alert */
  const deleteAlert = useCallback(async (id: number) => {
    try {
      await destroyAlert(id);
      setAlerts(prev => prev.filter(a => a.id !== id));
    } catch (err) {
      setError("Failed to delete alert");
      throw err;
    }
  }, []);

  /** Mark a single alert read */
  const markRead = useCallback(async (id: number) => {
    try {
      const updated = await serviceMarkRead(id);
      setAlerts(prev =>
        prev.map(a => (a.id === id ? updated : a))
      );
      return updated;
    } catch (err) {
      setError("Failed to mark read");
      throw err;
    }
  }, []);

  /** Mark all alerts read */
  const markAllAsRead = useCallback(async () => {
    try {
      const data = await serviceMarkAllRead();
      setAlerts(data);
      return data;
    } catch (err) {
      setError("Failed to mark all read");
      throw err;
    }
  }, []);

  // Load alerts on mount
  useEffect(() => {
    fetchAlerts();
  }, [fetchAlerts]);

  return {
    alerts,
    loading,
    error,

    fetchAlerts,
    addAlert,
    getAlert,
    editAlert,
    deleteAlert,

    markRead,
    markAllAsRead,
  };
}
