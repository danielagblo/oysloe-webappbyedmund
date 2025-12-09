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

      if (userSubId && pendingObj?.subscription_id) {
        // call PUT (update) to mark subscription (body: { subscription_id })
        updateUserSub.mutate(
          {
            id: Number(userSubId),
            body: { subscription_id: pendingObj.subscription_id },
          },
          {
            onSuccess: () => {
              localStorage.removeItem("pending_subscription");
              qc.invalidateQueries({ queryKey: ["user-subscriptions"] });
              navigate("/profile");
            },
            onError: () => {
              // fallback: refresh list
              qc.invalidateQueries({ queryKey: ["user-subscriptions"] });
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
          // call PUT to update/confirm the subscription as requested
          updateUserSub.mutate(
            {
              id: Number(found.id),
              body: { subscription_id: pendingObj.subscription_id },
            },
            {
              onSuccess: () => {
                localStorage.removeItem("pending_subscription");
                qc.invalidateQueries({ queryKey: ["user-subscriptions"] });
                navigate("/profile");
              },
              onError: () => {
                qc.invalidateQueries({ queryKey: ["user-subscriptions"] });
                localStorage.removeItem("pending_subscription");
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
