import { useState } from "react";
import Subscription from "../assets/Subscription.png";
import useIsSmallScreen from "../hooks/useIsSmallScreen";
import {
  useCreateUserSubscription,
  useSubscriptions,
  useUpdateUserSubscription,
  useUserSubscriptions,
} from "../features/subscriptions/useSubscriptions";
import { initiatePaystackPayment } from "../services/paymentService";

const SubscriptionPage = () => {
  const isSmall = useIsSmallScreen();
  const subsQuery = useSubscriptions();
  const userSubsQuery = useUserSubscriptions();

  const createSub = useCreateUserSubscription();
  const updateSub = useUpdateUserSubscription();

  const subscriptions = subsQuery.data ?? [];
  const userSubscriptions = userSubsQuery.data ?? [];

  const activeUserSub = userSubscriptions.length ? userSubscriptions[0] : null;

  const now = Date.now();
  const activeNotExpired =
    !!activeUserSub && new Date(activeUserSub.end_date).getTime() > now;
  const activeSubId = activeUserSub?.subscription?.id ?? null;

  // track which subscription is currently being processed and selected
  const [subscribingId, setSubscribingId] = useState<number | null>(null);
  const [updatingId, setUpdatingId] = useState<number | null>(null);
  const [selectedSubId, setSelectedSubId] = useState<number | null>(null);

  const handleSubscribe = (id: number) => {
    (async () => {
      try {
        setSubscribingId(id);
        const callbackUrl = `${window.location.origin}/paystack/callback`;
        // store pending subscription so callback knows which subscription was bought
        localStorage.setItem(
          "pending_subscription",
          JSON.stringify({ subscription_id: id }),
        );

        const res = await initiatePaystackPayment({
          subscription_id: id,
          callback_url: callbackUrl,
        });

        // attempt to extract redirect URL from common shapes
        const redirectUrl =
          res?.data?.authorization_url ||
          res?.authorization_url ||
          res?.data?.url ||
          res?.url ||
          res?.authorizationUrl;

        if (redirectUrl) {
          // redirect to Paystack checkout in the same tab
          window.location.assign(redirectUrl);
          return;
        }

        // fallback: create user subscription record directly if backend doesn't return a redirect URL
        createSub.mutate({ subscription_id: id });
      } catch (err) {
        // if initiation failed, clear state and show fallback
        console.error("Paystack initiation failed", err);
      } finally {
        setSubscribingId(null);
      }
    })();
  };

  const handlePayNow = () => {
    if (selectedSubId !== null) {
      handleSubscribe(selectedSubId);
    }
  };

  const handleRenew = (userSubId: number, subscriptionId: number) => {
    (async () => {
      try {
        setUpdatingId(userSubId);

        // include the user subscription id in the callback so the callback
        // handler can perform a direct update for the specific record
        const callbackUrl = `${window.location.origin}/paystack/callback?user_subscription_id=${userSubId}`;

        // store pending subscription so callback knows which subscription was bought
        localStorage.setItem(
          "pending_subscription",
          JSON.stringify({ subscription_id: subscriptionId }),
        );

        const res = await initiatePaystackPayment({
          subscription_id: subscriptionId,
          callback_url: callbackUrl,
        });

        // attempt to extract redirect URL from common shapes
        const redirectUrl =
          res?.data?.authorization_url ||
          res?.authorization_url ||
          res?.data?.url ||
          res?.url ||
          res?.authorizationUrl;

        if (redirectUrl) {
          // open Paystack checkout in the same tab — callback will update the user subscription
          window.location.assign(redirectUrl);
          return;
        }

        // fallback: call update directly if backend didn't return a redirect URL
        updateSub.mutate(
          { id: userSubId, body: { subscription_id: subscriptionId } },
          {
            onSettled: () => setUpdatingId(null),
          },
        );
      } catch (err) {
        // log and clear state
        console.error("Paystack initiation failed", err);
      } finally {
        setUpdatingId(null);
      }
    })();
  };

  // Mobile layout
  if (isSmall) {
    return (
      <>
        <div className="flex flex-col w-full h-screen w-screen bg-gray-50 px-4 py-8 max-sm:py-20 overflow-y-auto">
          {activeUserSub && (
            <div className="bg-(--div-active) max-sm:bg-white flex p-4 rounded-2xl justify-between items-center gap-2 w-full mb-6">
              <div className="w-full flex flex-col justify-start items-start gap-4">
                <p className="text-sm font-light text-nowrap">
                  You're currently subscribed
                </p>
                <div className="flex justify-start items-start gap-4">
                  <p className="font-medium text-xs bg-[#FFECEC] px-1.5 py-0.5">
                    {activeUserSub.subscription.name}
                  </p>
                  <p className="font-medium text-xs">
                    Expires{" "}
                    {new Date(activeUserSub.end_date).toLocaleDateString()}
                  </p>
                </div>
              </div>
              <img src={Subscription} alt="subscription" className="w-16" />
            </div>
          )}

          <h2 className="text-center text-gray-500 font-medium mb-8">
            Choose a monthly plan that works for you
          </h2>

          {subsQuery.isLoading && <p className="text-center">Loading plans...</p>}
          {subsQuery.isError && (
            <p className="text-center text-red-500">Failed to load plans</p>
          )}

          <div className="flex flex-col gap-6 flex-1">
            {subscriptions.map((s) => (
              <div
                key={s.id}
                onClick={() => setSelectedSubId(s.id)}
                className={`rounded-2xl relative p-4 border cursor-pointer transition-all ${
                  selectedSubId === s.id
                    ? "border-4 border-black bg-white"
                    : "border-4 border-transparent bg-white"
                }`}
              >
                <div className="flex justify-between items-start mb-3">
                  <p className="font-bold text-lg">
                    {s.name}{" "}
                    <span className="font-normal text-gray-600">
                      {s.multiplier ? `${s.multiplier}x` : ""}
                    </span>
                  </p>
                  {s.discount_percentage && (
                    <div className="absolute right-5 -top-4 bg-gray-900 text-white text-xs p-2 rounded-full">
                      For you {Number(s.discount_percentage).toString()}% off
                    </div>
                  )}
                </div>

                {s.features_list && (
                  <ul className="mb-4 space-y-2">
                    {s.features_list.map((f, i) => (
                      <li key={i} className="text-sm text-gray-700">
                        <span className="font-bold">✓ </span>
                        {f}
                      </li>
                    ))}
                  </ul>
                )}

                <div className="flex justify-start items-center gap-4">
                  <p className="font-bold">
                    ₵ {Number(s.effective_price ?? s.price).toFixed(0)}
                  </p>
                  {s.original_price && (
                    <p className="text-gray-500 text-sm">
                      ₵{" "}
                      <span className="line-through">
                        {Number(s.original_price).toFixed(0)}
                      </span>
                    </p>
                  )}
                </div>
              </div>
            ))}
          </div>

          <button
            onClick={handlePayNow}
            disabled={selectedSubId === null || subscribingId !== null}
            className="w-full bg-gray-200  font-medium py-3 rounded-xl mt-8 hover:bg-gray-800 disabled:opacity-50 disabled:cursor-not-allowed transition"
          >
            {subscribingId !== null ? "Processing..." : "Pay Now"}
          </button>
        </div>
      </>
    );
  }

  // Desktop layout
  return (
    <>
      <div className="flex justify-between h-screen w-screen items-center gap-2 no-scrollbar">
      <div className="flex flex-col lg:flex-row w-full -mt-10 md:mt-4 h-full md:py-[2vh] min-h-0 max-h-screen lg:overflow-hidden overflow-auto justify-start gap-4 no-scrollbar">
        <div className="lg:w-1/2">
          <div className="w-full md:bg-white md:h-[95vh] lg:overflow-auto no-scrollbar lg:w-full pt-20 md:mt-0 flex flex-col justify-start items-center gap-4 px-3 md:py-3 rounded-2xl text-xs">
            <div className="flex pt-5 px-5 flex-col justify-start gap-2 mb-2 w-full">
              <div className="bg-(--div-active) flex p-4 rounded-2xl justify-between items-center gap-2 w-full">
                <div className="w-full flex flex-col justify-start items-start gap-4">
                  <p className="md:text-[1.25rem] max-md:text-[0.8rem]  font-light text-nowrap">
                    You're currently subscribed
                  </p>
                  {activeUserSub ? (
                    <div className="flex justify-start items-start gap-4">
                      <p className="font-medium max-md:text-[0.5rem] bg-[#FFECEC] px-1.5 py-0.5">
                        {activeUserSub.subscription.name}
                      </p>
                      <p className="font-medium max-md:text-[0.5rem]">
                        Expires{" "}
                        {new Date(activeUserSub.end_date).toLocaleDateString()}
                      </p>
                    </div>
                  ) : (
                    <div className="flex justify-start items-start gap-4">
                      <p className="font-medium max-md:text-[0.5rem] bg-[#FFECEC] px-1.5 py-0.5">
                        Not Subscribed
                      </p>
                    </div>
                  )}
                </div>
                <img
                  src={Subscription}
                  alt="subscription"
                  className="w-[20%] z-200"
                />
              </div>
              {activeUserSub && (
                <div className="w-full px-2">
                  <button
                    className="bg-(--div-active) w-full py-3 rounded text-center mt-2"
                    onClick={() =>
                      handleRenew(
                        activeUserSub.id,
                        activeUserSub.subscription.id,
                      )
                    }
                    disabled={
                      updatingId === activeUserSub.id || activeNotExpired
                    }
                  >
                    {updatingId === activeUserSub.id
                      ? "Processing..."
                      : activeNotExpired
                        ? `Active — expires ${new Date(
                            activeUserSub.end_date,
                          ).toLocaleDateString()}`
                        : "Renew / Update"}
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>

        <div className="lg:w-1/2">
          <div className="bg-white w-full md:h-[95vh] lg:overflow-auto no-scrollbar mt-2 md:mt-0 flex flex-col justify-start items-center gap-4 h-fit px-2 py-3 md:rounded-2xl text-xs max-lg:mb-10 lg:pb-17">
            <div className="flex pt-5 px-5 flex-col justify-start gap-6 mb-2 w-full">
              <p className="text-center text-gray-500">
                Choose a monthly plan that works for you
              </p>

              {subsQuery.isLoading && (
                <p className="text-center">Loading plans...</p>
              )}
              {subsQuery.isError && (
                <p className="text-center text-red-500">Failed to load plans</p>
              )}

              {subscriptions.map((s) => (
                <div
                  key={s.id}
                  className="relative bg-(--div-active) rounded-2xl flex flex-col justify-start items-start gap-2 p-4 w-full"
                >
                  {s.discount_percentage && (
                    <div className="absolute -top-2 right-4 z-10 py-1 px-2 rounded-2xl bg-gray-900 text-white text-center text-xs">
                      {Number(s.discount_percentage).toString()}% off
                    </div>
                  )}

                  <p className="font-bold">
                    {s.name}{" "}
                    <span className="font-normal">
                      {s.multiplier ? `${s.multiplier}x` : ""}
                    </span>
                  </p>
                  {s.features_list && (
                    <ul>
                      {s.features_list.map((f, i) => (
                        <li key={i}>
                          <span className="font-bold">&#10004; </span>
                          <span className="text-gray-500">{f}</span>
                        </li>
                      ))}
                    </ul>
                  )}

                  <div className="flex justify-start items-start gap-4 w-full">
                    <p className="font-bold text-sm">
                      ₵ {Number(s.effective_price ?? s.price).toFixed(2)}
                    </p>
                    {s.original_price && (
                      <p className="text-gray-500">
                        ₵{" "}
                        <span className="line-through">
                          {Number(s.original_price).toFixed(2)}
                        </span>
                      </p>
                    )}
                  </div>

                  <div className="w-full flex items-center justify-center">
                    <button
                      className="bg-gray-200 hover:scale-95 active:scale-105 hover:bg-gray-100 cursor-pointer lg:w-4/5 transition w-full py-3 rounded text-center mt-2"
                      title="Clicking this will open Paystack. Complete payment to Subscribe and be redirected back."
                      onClick={() => handleSubscribe(s.id)}
                      disabled={
                        subscribingId === s.id ||
                        (activeNotExpired && activeSubId === s.id)
                      }
                    >
                      {subscribingId === s.id
                        ? "Processing..."
                        : activeNotExpired && activeSubId === s.id
                          ? "Current plan"
                          : "Subscribe / Pay Now"}
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
      </div>
    </>
  );
};

export default SubscriptionPage;
