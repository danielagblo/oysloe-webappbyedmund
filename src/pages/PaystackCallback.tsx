import { useQueryClient } from "@tanstack/react-query";
import { useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { useUpdateUserSubscription } from "../features/subscriptions/useSubscriptions";
import { verifyPaystackTransaction } from "../services/paymentService";
import { getUserSubscriptions } from "../services/userSubscriptionService";

const PaystackCallback = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const updateUserSub = useUpdateUserSubscription();
  const qc = useQueryClient();

  useEffect(() => {
    (async () => {
      // Try to read the user_subscription id from query string
      const userSubId =
        searchParams.get("user_subscription_id") ||
        searchParams.get("user_subscription") ||
        searchParams.get("userSubscriptionId") ||
        searchParams.get("id");
      const reference =
        searchParams.get("reference") ||
        searchParams.get("trxref") ||
        searchParams.get("ref");

      // Read pending subscription stored before redirect
      const pending = localStorage.getItem("pending_subscription");
      let pendingObj: { subscription_id?: number } | null = null;
      try {
        pendingObj = pending ? JSON.parse(pending) : null;
      } catch (e) {
        pendingObj = null;
      }

      // Fallback: if localStorage missing (different domain), try to read subscription_id from query
      const subscriptionIdFromQuery = searchParams.get("subscription_id");
      if (!pendingObj && subscriptionIdFromQuery) {
        const parsed = Number(subscriptionIdFromQuery);
        if (!Number.isNaN(parsed)) {
          pendingObj = { subscription_id: parsed };
        }
      }

      if (userSubId && pendingObj?.subscription_id) {
        // Prevent repeated attempts for the same user subscription id
        const attemptedKey = `pending_subscription_attempted_user_${userSubId}`;
        if (localStorage.getItem(attemptedKey)) {
          // Already tried updating this user subscription; just refresh and navigate
          qc.invalidateQueries({ queryKey: ["user-subscriptions"] });
          localStorage.removeItem("pending_subscription");
          navigate("/profile");
          return;
        }

        // mark as attempted so we don't keep retrying on reloads
        localStorage.setItem(attemptedKey, String(Date.now()));

        // call PUT (update) to mark subscription (body: { subscription_id })
        updateUserSub.mutate(
          {
            id: Number(userSubId),
            body: { subscription_id: pendingObj.subscription_id },
          },
          {
            onSuccess: () => {
              localStorage.removeItem("pending_subscription");
              localStorage.removeItem(attemptedKey);
              qc.invalidateQueries({ queryKey: ["user-subscriptions"] });
              try {
                localStorage.setItem("profile_active_tab", "subscription");
              } catch (e) {
                // ignore storage errors
              }
              navigate("/profile");
            },
            onError: () => {
              // fallback: refresh list and clear pending so polling branch won't re-run
              qc.invalidateQueries({ queryKey: ["user-subscriptions"] });
              localStorage.removeItem("pending_subscription");
              localStorage.removeItem(attemptedKey);
              try {
                localStorage.setItem("profile_active_tab", "subscription");
              } catch (e) {
                // ignore storage errors
              }
              navigate("/profile");
            },
          },
        );
        return;
      }

      // If a Paystack reference is present, trigger server-side verification first
      if (reference) {
        try {
          await verifyPaystackTransaction(reference);
        } catch (err) {
          // verification failed or server didn't accept it — continue to polling fallback
          // eslint-disable-next-line no-console
          console.warn("verifyPaystackTransaction failed", err);
        }
      }

      // if no explicit user subscription id but we have a pending subscription,
      // poll the user's subscriptions for the created record and update it
      if (pendingObj?.subscription_id) {
        const maxAttempts = 6;
        const delayMs = 2000;
        let found = null as null | { id: number; subscription: { id: number } };
        for (let i = 0; i < maxAttempts; i++) {
          try {
            const list = await getUserSubscriptions();
            found =
              list.find(
                (us: any) =>
                  us.subscription?.id === pendingObj!.subscription_id,
              ) ?? null;
            if (found) break;
          } catch (e) {
            // ignore and retry
          }
          // wait before next attempt
          // eslint-disable-next-line no-await-in-loop
          await new Promise((res) => setTimeout(res, delayMs));
        }

        if (found) {
          const attemptedKey = `pending_subscription_attempted_user_${found.id}`;
          if (localStorage.getItem(attemptedKey)) {
            qc.invalidateQueries({ queryKey: ["user-subscriptions"] });
            localStorage.removeItem("pending_subscription");
            try {
              localStorage.setItem("profile_active_tab", "subscription");
            } catch (e) {
              // ignore storage errors
            }
            navigate("/profile");
            return;
          }
          localStorage.setItem(attemptedKey, String(Date.now()));

          // call PUT to update/confirm the subscription as requested
          updateUserSub.mutate(
            {
              id: Number(found.id),
              body: { subscription_id: pendingObj.subscription_id },
            },
            {
              onSuccess: () => {
                localStorage.removeItem("pending_subscription");
                localStorage.removeItem(attemptedKey);
                qc.invalidateQueries({ queryKey: ["user-subscriptions"] });
                try {
                  localStorage.setItem("profile_active_tab", "subscription");
                } catch (e) {
                  // ignore storage errors
                }
                navigate("/profile");
              },
              onError: () => {
                qc.invalidateQueries({ queryKey: ["user-subscriptions"] });
                localStorage.removeItem("pending_subscription");
                localStorage.removeItem(attemptedKey);
                try {
                  localStorage.setItem("profile_active_tab", "subscription");
                } catch (e) {
                  // ignore storage errors
                }
                navigate("/profile");
              },
            },
          );
          return;
        }
      }

      // fallback: refresh list and navigate back
      qc.invalidateQueries({ queryKey: ["user-subscriptions"] });
      localStorage.removeItem("pending_subscription");
      navigate("/profile");
    })();
  }, [searchParams, updateUserSub, qc, navigate]);

  return (
    <div className="h-screen w-screen flex items-center justify-center">
      <p>Processing payment confirmation...</p>
    </div>
  );
};

export default PaystackCallback;
