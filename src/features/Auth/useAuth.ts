import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  login,
  logout as logoutService,
  otpLogin,
  register,
} from "../../services/authService";
import firebaseMessaging from "../../services/firebaseMessaging";
import notificationService from "../../services/notificationService";
import userProfileService from "../../services/userProfileService";
import type {
  LoginRequest,
  OTPLoginRequest,
  RegisterRequest,
} from "../../types/Auth";

const STORAGE_TOKEN_KEY = "oysloe_token";
const STORAGE_USER_KEY = "oysloe_user";

export function useLogin() {
  const qc = useQueryClient();
  return useMutation<Awaited<ReturnType<typeof login>>, Error, LoginRequest>({
    mutationFn: login,
    onSuccess: (data) => {
      localStorage.setItem(STORAGE_TOKEN_KEY, data.token);
      localStorage.setItem(STORAGE_USER_KEY, JSON.stringify(data.user));
      qc.setQueryData(["currentUser"], data.user);
      console.debug("useLogin.onSuccess: user logged in");
      // Best-effort: register push subscription after successful login
      try {
        const opted = (() => {
          try {
            return localStorage.getItem("oysloe_notifications_opt_in") === "true";
          } catch (e) {
            return false;
          }
        })();
        if (opted) {
          // prefer FCM token path
          firebaseMessaging.registerAndSaveToken()
            .then((t) => console.debug("registerAndSaveToken result", t))
            .catch((err) => console.error("registerAndSaveToken error", err));
        } else {
          console.debug("User did not opt-in to notifications; skipping registration");
        }
      } catch (e) {
        // fallback to PushSubscription flow
        try {
          notificationService.registerLocalSubscription()
            .then((r) => console.debug("registerLocalSubscription result", r))
            .catch((err) => console.error("registerLocalSubscription error", err));
        } catch (e2) {
          void e2;
        }
      }
    },
  });
}

export function useRegister() {
  const qc = useQueryClient();
  return useMutation<
    Awaited<ReturnType<typeof register>>,
    Error,
    RegisterRequest
  >({
    mutationFn: register,
    onSuccess: (data) => {
      localStorage.setItem(STORAGE_TOKEN_KEY, data.token);
      localStorage.setItem(STORAGE_USER_KEY, JSON.stringify(data.user));
      qc.setQueryData(["currentUser"], data.user);
    },
  });
}

export function useOTPLogin() {
  const qc = useQueryClient();
  return useMutation<
    Awaited<ReturnType<typeof otpLogin>>,
    Error,
    OTPLoginRequest
  >({
    mutationFn: otpLogin,
    onSuccess: (data) => {
      localStorage.setItem(STORAGE_TOKEN_KEY, data.token);
      localStorage.setItem(STORAGE_USER_KEY, JSON.stringify(data.user));
      qc.setQueryData(["currentUser"], data.user);
    },
  });
}
export function useLogout() {
  const qc = useQueryClient();
  return useMutation<Awaited<ReturnType<typeof logoutService>>, Error, void>({
    mutationFn: () => logoutService(),
    // Always clear client-side auth state regardless of server response.
    onSettled: () => {
      localStorage.removeItem(STORAGE_TOKEN_KEY);
      localStorage.removeItem(STORAGE_USER_KEY);
      qc.removeQueries({ queryKey: ["currentUser"] });
      // Best-effort: unregister any local push subscription on logout
      try {
        // prefer removing FCM token
        void firebaseMessaging.removeAndNotify();
        void notificationService.unregisterLocalSubscription();
      } catch (e) {
        void e;
      }
    },
  });
}

export function useCurrentUser() {
  return useQuery({
    queryKey: ["currentUser"],
    queryFn: async () => {
      // Try to read localStorage first
      const raw = localStorage.getItem(STORAGE_USER_KEY);
      if (raw) {
        try {
          return JSON.parse(raw);
        } catch {
          // fallback to fetching profile
        }
      }

      // If no local user, try fetching from API (validates token)
      try {
        const profile = await userProfileService.getUserProfile();
        localStorage.setItem(STORAGE_USER_KEY, JSON.stringify(profile));
        return profile;
      } catch (err) {
        // clear token and rethrow so callers know user is unauthenticated
        localStorage.removeItem(STORAGE_TOKEN_KEY);
        localStorage.removeItem(STORAGE_USER_KEY);
        throw err;
      }
    },
    staleTime: 1000 * 60 * 5,
  });
}
