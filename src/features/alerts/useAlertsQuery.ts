import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import * as AlertsService from "../../services/alertService";
import { apiClient } from "../../services/apiClient";
import type { Alert } from "../../types/Alert";

export function useAlertsQuery() {
  const queryClient = useQueryClient();

  // Query for fetching alerts
  const {
    data: alerts = [],
    isLoading: loading,
    error,
  } = useQuery({
    queryKey: ["alerts"],
    queryFn: async () => {
      const result = await AlertsService.getAlerts();
      return result || [];
    },
  });

  // Mutation for marking alert as read
  const markReadMutation = useMutation({
    mutationFn: async (alertId: number) => {
      await apiClient.post(`/alerts/${alertId}/mark-read/`, {});
    },
    onMutate: async (alertId: number) => {
      await queryClient.cancelQueries({ queryKey: ["alerts"] });
      const previousAlerts = queryClient.getQueryData<Alert[]>(["alerts"]);

      if (previousAlerts) {
        queryClient.setQueryData(["alerts"], (old: Alert[]) =>
          old.map((alert) =>
            alert.id === alertId ? { ...alert, is_read: !alert.is_read } : alert
          )
        );
      }

      return { previousAlerts };
    },
    onError: (
      _err,
      _alertId,
      context: { previousAlerts?: Alert[] } | undefined
    ) => {
      if (context?.previousAlerts) {
        queryClient.setQueryData(["alerts"], context.previousAlerts);
      }
      toast.error("Failed to update alert");
    },
    onSuccess: () => {
      toast.success("Alert updated");
    },
  });

  // Mutation for deleting alert
  const deleteAlertMutation = useMutation({
    mutationFn: async (alertId: number) => {
      await apiClient.delete(`/alerts/${alertId}/delete/`);
    },
    onMutate: async (alertId: number) => {
      await queryClient.cancelQueries({ queryKey: ["alerts"] });
      const previousAlerts = queryClient.getQueryData<Alert[]>(["alerts"]);

      if (previousAlerts) {
        queryClient.setQueryData(["alerts"], (old: Alert[]) =>
          old.filter((alert) => alert.id !== alertId)
        );
      }

      return { previousAlerts };
    },
    onError: (
      _err,
      _alertId,
      context: { previousAlerts?: Alert[] } | undefined
    ) => {
      if (context?.previousAlerts) {
        queryClient.setQueryData(["alerts"], context.previousAlerts);
      }
      toast.error("Failed to delete alert");
    },
    onSuccess: () => {
      toast.success("Alert deleted");
    },
  });

  // Mutation for marking all alerts as read
  const markAllReadMutation = useMutation({
    mutationFn: async () => {
      await apiClient.post(`/alerts/mark-all-read/`, {});
    },
    onMutate: async () => {
      await queryClient.cancelQueries({ queryKey: ["alerts"] });
      const previousAlerts = queryClient.getQueryData<Alert[]>(["alerts"]);

      if (previousAlerts) {
        queryClient.setQueryData(["alerts"], (old: Alert[]) =>
          old.map((alert) => ({ ...alert, is_read: true }))
        );
      }

      return { previousAlerts };
    },
    onError: (
      _err,
      _variables,
      context: { previousAlerts?: Alert[] } | undefined
    ) => {
      if (context?.previousAlerts) {
        queryClient.setQueryData(["alerts"], context.previousAlerts);
      }
      toast.error("Failed to mark all as read");
    },
    onSuccess: () => {
      toast.success("All alerts marked as read");
    },
  });

  // Mutation for deleting all alerts
  const deleteAllMutation = useMutation({
    mutationFn: async () => {
      await Promise.all(
        alerts.map((alert) => apiClient.delete(`/alerts/${alert.id}/delete/`))
      );
    },
    onMutate: async () => {
      await queryClient.cancelQueries({ queryKey: ["alerts"] });
      const previousAlerts = queryClient.getQueryData<Alert[]>(["alerts"]);

      if (previousAlerts) {
        queryClient.setQueryData(["alerts"], () => []);
      }

      return { previousAlerts };
    },
    onError: (
      _err,
      _variables,
      context: { previousAlerts?: Alert[] } | undefined
    ) => {
      if (context?.previousAlerts) {
        queryClient.setQueryData(["alerts"], context.previousAlerts);
      }
      toast.error("Failed to delete all alerts");
    },
    onSuccess: () => {
      toast.success("All alerts deleted");
    },
  });

  return {
    alerts,
    loading,
    error,
    markReadMutation,
    deleteAlertMutation,
    markAllReadMutation,
    deleteAllMutation,
  };
}
