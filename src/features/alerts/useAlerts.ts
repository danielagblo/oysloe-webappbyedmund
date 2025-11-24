import { useState, useEffect } from "react";
import { ApiV1 } from "../../services/generated/ApiV1";
import type { Alert } from "../../services/generated/data-contracts";

const api = new ApiV1({ baseUrl: import.meta.env.VITE_API_BASE_URL });

export function useAlerts() {
  const [alerts, setAlerts] = useState<Alert[]>([]);
  const [loading, setLoading] = useState(true);

  // fetch user alerts
  const fetchAlerts = async () => {
    setLoading(true);
    try {
      const res = await api.apiV1AlertsList();
      setAlerts(res.data);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAlerts();
  }, []);

  // mark single alert read
  const markRead = async (id: number) => {
    const res = await api.apiV1AlertsMarkReadCreate(id, {} as Alert);
    setAlerts(prev => prev.map(a => (a.id === id ? res.data : a)));
  };

  // mark all as read
  const markAllRead = async () => {
    const res = await api.apiV1AlertsMarkAllReadCreate({} as Alert);
    setAlerts(res.data);
  };

  // delete alert
  const deleteAlert = async (id: number) => {
    await api.apiV1AlertsDeleteDestroy(id);
    setAlerts(prev => prev.filter(a => a.id !== id));
  };

  return { alerts, loading, fetchAlerts, markRead, markAllRead, deleteAlert };
}
