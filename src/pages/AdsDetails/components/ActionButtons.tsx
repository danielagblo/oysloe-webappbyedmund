import React, { useState } from "react";
import type { Product } from "../../../types/Product";

interface ActionButtonsProps {
  currentAdData?: Product | any;
  currentAdDataFromQuery?: Product | any;
  onMarkTaken?: () => void;
  onReportAd?: () => void;
  onCaller1?: () => void;
  onCaller2?: () => void;
  onMakeOffer?: () => void;
  onFavorite?: () => void;
  isFavourited?: boolean;
  caller1?: string | null;
  caller2?: string | null;
  showCaller1?: boolean;
  showCaller2?: boolean;
  toggleCaller1?: () => void;
  toggleCaller2?: () => void;
  showOffer?: boolean;
  toggleOffer?: () => void;
  favouritePending?: boolean;
  openChatWithOwnerAndSend: (text: string) => Promise<void> | void;
  setOpenPanel: React.Dispatch<React.SetStateAction<string | null>>;
}

const ActionButtons: React.FC<ActionButtonsProps> = ({
  currentAdData,
  currentAdDataFromQuery,
  onMarkTaken = () => {},
  onReportAd = () => {},
  onCaller1 = () => {},
  onCaller2 = () => {},
  onMakeOffer = () => {},
  onFavorite = () => {},
  isFavourited = false,
  caller1,
  caller2,
  showCaller1: showC1,
  showCaller2: showC2,
  toggleCaller1,
  toggleCaller2,
  showOffer: showOfferProp,
  toggleOffer,
  favouritePending = false,
  openChatWithOwnerAndSend,
  setOpenPanel,
}) => {
  const isTaken = Boolean(
    (currentAdData as any)?.is_taken ||
    (currentAdDataFromQuery as any)?.is_taken,
  );
  const showOffer = Boolean(showOfferProp);
  const [offerInput, setOfferInput] = useState<string>("");
  const actions: Record<string, () => void> = {
    "Mark as taken": isTaken ? () => {} : onMarkTaken || (() => {}),
    "Report Ad": onReportAd,
    "Caller 1": onCaller1,
    "Caller 2": onCaller2,
    "Make Offer": onMakeOffer,
    Favorites: onFavorite,
  };

  return (
    <div>
      <div className="flex flex-wrap gap-2 mb-1 max-sm:grid max-sm:grid-cols-2">
        {(() => {
          const items: Array<[string, string]> = [
            ["mark as taken.svg", "Mark as taken"],
            ["flag.svg", "Report Ad"],
            ["outgoing call.svg", "Caller 1"],
            ...(caller2 ? ([ ["outgoing call.svg", "Caller 2"] ] as [string, string][]) : []),
            ["Make an offer.svg", "Make Offer"],
            ["favorited.svg", "Favorites"],
          ];
          return items.map(([icon, label]) => (
            <div key={label} className="relative inline-block">
              <button
                key={label}
                className={`flex items-center max-sm:w-full gap-2 max-sm:py-6 p-4 h-5 rounded-lg text-sm md:text-[1.125vw] bg-(--div-active) transition sm:bg-white hover:bg-gray-50
                  ${actions[label]
                    ? "cursor-pointer hover:bg-gray-200 lg:hover:scale-95 active:scale-105"
                    : "cursor-not-allowed"
                  }
                `}
                onClick={(e) => {
                  e.stopPropagation();
                  if (label === "Caller 1") {
                    (toggleCaller1 || (() => {}))();
                    return;
                  }
                  if (label === "Caller 2") {
                    (toggleCaller2 || (() => {}))();
                    return;
                  }
                  if (label === "Make Offer") {
                    (toggleOffer || (() => {}))();
                    return;
                  }
                  if (label === "Favorites" && favouritePending) return;
                  actions[label]();
                }}
                disabled={label === "Favorites" && favouritePending}
              >
                {label === "Favorites" ? (
                  <>
                    <img
                      src={
                        isFavourited ? "/favorited.svg" : "/heart-outline.svg"
                      }
                      alt=""
                      className="w-4 h-4 md:h-[1.125vw] md:w-[1.125vw]"
                    />
                    <p className="whitespace-nowrap">
                      {isFavourited ? "Liked" : "Like"}
                    </p>
                  </>
                ) : (
                  <>
                    {label === "Mark as taken" && isTaken ? (
                      <>
                        <img
                          src="/check.svg"
                          alt=""
                          className="w-4 h-4 md:h-[1.125vw] md:w-[1.125vw]"
                        />
                        <p className="whitespace-nowrap">Taken</p>
                      </>
                    ) : (
                      <>
                        <img
                          src={`/${icon}`}
                          alt=""
                          className="w-4 h-4 md:h-[1.125vw] md:w-[1.125vw]"
                        />
                        <p className="whitespace-nowrap">{label}</p>
                      </>
                    )}
                  </>
                )}
              </button>

              {label === "Caller 1" && showC1 && caller1 && (
                <div
                  className="fixed inset-0 z-50 flex items-center justify-center bg-black/40"
                  onClick={() => setOpenPanel(null)}
                >
                  <div
                    className="bg-white rounded-2xl p-4 shadow-md text-sm w-72"
                    onClick={(e) => e.stopPropagation()}
                  >
                    <div className="flex flex-col items-center gap-4">
                      <div className="font-semibold flex items-center gap-2">
                        <img
                          src="/outgoing call.svg"
                          alt=""
                          className="w-4 h-auto"
                        />
                        <span className="text-sm">Caller 1</span>
                      </div>
                      <a
                        href={`tel:${caller1}`}
                        onClick={(ev) => ev.stopPropagation()}
                        className="font-normal flex items-center gap-2 text-sm"
                        style={{ color: "var(--dark-def)", textDecoration: "none" }}
                      >
                        <span className="border border-gray-200 px-2.5 py-1.5">Call</span>
                        <span className="border border-gray-200 px-2.5 py-1.5">{caller1}</span>
                      </a>
                      <div className="w-full flex justify-end">
                        <button
                          onClick={() => setOpenPanel(null)}
                          className="mt-2 px-3 py-1 rounded bg-gray-100"
                        >
                          Close
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {label === "Make Offer" && showOffer && (
                <div
                  className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 max-sm:p-4"
                  onClick={() => (toggleOffer || (() => {}))()}
                >
                  <div
                    className="bg-white rounded-2xl p-4 lg:pb-4 shadow-md text-sm w-full sm:w-80 h-auto sm:h-fit overflow-auto sm:min-w-96"
                    onClick={(e) => e.stopPropagation()}
                  >
                    <div className="flex flex-col items-center gap-3">
                      <div className="flex items-center gap-2 text-xs font-semibold">
                        <img
                          src="/Make an offer.svg"
                          alt=""
                          className="w-4 h-auto lg:w-[1.5vw]"
                        />
                        <span className="text-xs sm:text-sm lg:text-[1.2vw]">
                          Make Offer
                        </span>
                      </div>
                      <div className="w-full flex flex-col gap-2">
                        <div className="flex gap-2">
                          {["~5% cut", "~10% cut", "~15% cut", "~20% cut"].map(
                            (opt) => (
                              <button
                                key={opt}
                                type="button"
                                className="w-full text-center whitespace-nowrap py-2 rounded bg-(--div-active) text-xs sm:text-sm lg:text-[1.2vw] text-(--dark-def) font-medium focus:outline-none"
                                onClick={(ev) => {
                                  ev.stopPropagation();
                                  setOfferInput(`${opt} off on overall price`);
                                }}
                              >
                                {opt}
                              </button>
                            ),
                          )}
                        </div>
                        <div className="flex gap-2 mt-1">
                          <input
                            type="text"
                            value={offerInput}
                            onChange={(e) => setOfferInput(e.target.value)}
                            className="flex-1 px-3 py-2 rounded bg-white border border-gray-200 text-sm"
                            onClick={(ev) => ev.stopPropagation()}
                          />
                          <button
                            type="button"
                            className="border border-gray-200 px-1 rounded bg-(--div-active) text-(--dark-def) font-medium"
                            onClick={async (ev) => {
                              ev.stopPropagation();
                              if (!offerInput || offerInput.trim().length === 0) return;
                              await openChatWithOwnerAndSend(offerInput.trim());
                              (toggleOffer || (() => {}))();
                            }}
                          >
                            <img
                              src="/send.svg"
                              alt="Send"
                              className="w-8 h-8"
                            />
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {label === "Caller 2" && showC2 && caller2 && (
                <div
                  className="fixed inset-0 z-50 flex items-center justify-center bg-black/40"
                  onClick={() => setOpenPanel(null)}
                >
                  <div
                    className="bg-white rounded-2xl p-4 shadow-md text-sm w-72"
                    onClick={(e) => e.stopPropagation()}
                  >
                    <div className="flex flex-col items-center gap-4">
                      <div className="font-semibold flex items-center gap-2">
                        <img src="/outgoing call.svg" alt="" className="w-4 h-auto" />
                        <span className="text-sm">Caller 2</span>
                      </div>
                      <a
                        href={`tel:${caller2}`}
                        onClick={(ev) => ev.stopPropagation()}
                        className="font-normal flex items-center gap-2 text-sm"
                        style={{ color: "var(--dark-def)", textDecoration: "none" }}
                      >
                        <span className="border border-gray-200 px-2.5 py-1.5">Call</span>
                        <span className="border border-gray-200 px-2.5 py-1.5">{caller2}</span>
                      </a>
                      <div className="w-full flex justify-end">
                        <button
                          onClick={() => setOpenPanel(null)}
                          className="mt-2 px-3 py-1 rounded bg-gray-100"
                        >
                          Close
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          ));
        })()}
      </div>
    </div>
  );
};

export default React.memo(ActionButtons);
