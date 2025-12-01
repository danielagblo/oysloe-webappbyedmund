import { useEffect, useState } from "react";
import { toast } from 'sonner';
import "../App.css";
import Button from "../components/Button";
import CopyButton from "../components/CopyButton";
import MenuButton from "../components/MenuButton";
import ProgressBar from "../components/ProgressBar";
import useApplyCoupon from "../features/coupons/useApplyCoupon";
import useRedeemPoints from "../features/redeem/useRedeemPoints";
import useUserProfile from "../features/userProfile/useUserProfile";
import type { Level } from "../types/UserProfile";
const ReferPage = () => {
  const [how, setHow] = useState(false);
  const [redraw, setRedraw] = useState(false);
  const [apply, setApply] = useState(false);
  const [showLevel, setShowLevel] = useState(false);
  useEffect(() => {
    if (window.innerWidth >= 1024) {
      setHow(true);
    }
  }, []);

  // profile data for referral UI
  const { profile, refetchProfile } = useUserProfile();
  // referral_points is an absolute points value (e.g. 9000).
  const points = Number(profile?.referral_points ?? 0) || 0;

  // Define level thresholds
  const THRESHOLDS = {
    silver: 0,
    gold: 10000,
    diamond: 100000,
  } as const;

  // Redeem rules: blocks of points can be redeemed for GH₵
  // 1 block = 2,500 points => GH₵500
  const REDEEM_BLOCK_POINTS = 2500;
  const REDEEM_BLOCK_VALUE_GHC = 500;
  const redeemableBlocks = Math.floor(points / REDEEM_BLOCK_POINTS);
  const redeemableGhc = redeemableBlocks * REDEEM_BLOCK_VALUE_GHC;
  const equivalentGhcExact =
    points * (REDEEM_BLOCK_VALUE_GHC / REDEEM_BLOCK_POINTS);

  const redrawTooltip =
    redeemableBlocks > 0
      ? `You can redraw only ${REDEEM_BLOCK_POINTS.toLocaleString()} points for GH₵${REDEEM_BLOCK_VALUE_GHC} per block. You have ${redeemableBlocks} block${redeemableBlocks > 1 ? "s" : ""} (GH₵${redeemableGhc.toLocaleString()}).`
      : `You can't redraw — you need at least ${REDEEM_BLOCK_POINTS.toLocaleString()} points to redraw.`;

  // normalize level string
  const profileLevelTyped = (profile?.level || "") as Level | "";
  const profileLevel = profileLevelTyped.toLowerCase();

  // compute percent progress and the follow-up text
  let displayPercent = 0;
  let nextText = "";

  if (profileLevel === "gold") {
    // progress from gold (10k) to diamond (100k)
    const lower = THRESHOLDS.gold;
    const upper = THRESHOLDS.diamond;
    const denom = Math.max(1, upper - lower);
    displayPercent = Math.round(((points - lower) / denom) * 100);
    if (!isFinite(displayPercent) || displayPercent < 0) displayPercent = 0;
    if (displayPercent > 100) displayPercent = 100;
    const remaining = Math.max(0, upper - points);
    nextText = `${remaining.toLocaleString()} points to diamond`;
  } else if (profileLevel === "silver") {
    // progress from silver (0) to gold (10k)
    const lower = THRESHOLDS.silver;
    const upper = THRESHOLDS.gold;
    const denom = Math.max(1, upper - lower);
    displayPercent = Math.round(((points - lower) / denom) * 100);
    if (!isFinite(displayPercent) || displayPercent < 0) displayPercent = 0;
    if (displayPercent > 100) displayPercent = 100;
    const remaining = Math.max(0, upper - points);
    nextText = `${remaining.toLocaleString()} points to gold`;
  } else if (profileLevel === "diamond") {
    // diamond is top tier — show points and full progress
    displayPercent = 100;
    nextText = `${points.toLocaleString()} points`;
  } else {
    // unknown level: show progress to gold as default
    const upper = THRESHOLDS.gold;
    displayPercent = Math.round((points / Math.max(1, upper)) * 100);
    if (!isFinite(displayPercent) || displayPercent < 0) displayPercent = 0;
    if (displayPercent > 100) displayPercent = 100;
    const remaining = Math.max(0, upper - points);
    nextText = `${remaining.toLocaleString()} points to gold`;
  }

  // additional helpers for Level view
  const remainingToGold = Math.max(0, THRESHOLDS.gold - points);
  const remainingToDiamond = Math.max(0, THRESHOLDS.diamond - points);
  let silverPercent = Math.round((points / Math.max(1, THRESHOLDS.gold)) * 100);
  if (!isFinite(silverPercent) || silverPercent < 0) silverPercent = 0;
  if (silverPercent > 100) silverPercent = 100;
  let goldPercent = Math.round(
    ((points - THRESHOLDS.gold) /
      Math.max(1, THRESHOLDS.diamond - THRESHOLDS.gold)) *
      100,
  );
  if (!isFinite(goldPercent) || goldPercent < 0) goldPercent = 0;
  if (goldPercent > 100) goldPercent = 100;
  const diamondPointsText = `${points.toLocaleString()} points`;
  let diamondPercent = Math.round(
    (points / Math.max(1, THRESHOLDS.diamond)) * 100,
  );
  if (!isFinite(diamondPercent) || diamondPercent < 0) diamondPercent = 0;
  if (diamondPercent > 100) diamondPercent = 100;

  // paymentData removed (no transactions endpoint available)

  const Refer = () => (
    <div className="h-full md:min-h-[92vh] md:overflow-auto no-scrollbar w-full flex flex-col gap-2">
      <h2 className="md:hidden max-md:block w-full text-center text-2xl font-bold max-md:mt-2 text-[var(--dark-def)]">
        &nbsp; &nbsp; &nbsp;Refer a Friend
      </h2>
      <div className="max-md:px-2 max-md:mt-3">
        <div className="bg-white w-full h-20 rounded-2xl p-5 flex justify-between items-center shadow-sm self-end">
          <div className="flex gap-2 my-2 ">
            <img
              src="/star green.svg"
              alt=""
              className="w-4 h-4 md:w-[1.2vw] md:h-[1.2vw] my-auto"
            />
            <h2 className="text-sm md:text-[1.2vw]">Points</h2>
          </div>
          <div className="flex flex-col gap-1">
            <div
              className="flex gap-6 items-center justify-end"
              onClick={() => {
                setHow(false);
                setApply(false);
                setRedraw(true);
                setShowLevel(false);
              }}
            >
              <span className="text-xl">{points.toLocaleString()}</span>
              <img className="" src="/arrowright.svg" alt="" />
            </div>
            <span className="-m-3 pt-2 pr-8.5 text-xs text-gray-400">
              {`= GH₵${equivalentGhcExact.toFixed(2)}`}
            </span>
          </div>
        </div>
      </div>
      {/* compute display percent from profile */}
      <div className="flex gap-4 w-full px-2 md:px-0">
        <div
          className="bg-white w-full h-20 rounded-2xl p-3 flex justify-between items-center gap-2 shadow-sm"
          onClick={() => {
            setRedraw(false);
            setHow(false);
            setApply(true);
            setShowLevel(false);
          }}
        >
          <div className="flex flex-col items-center justify-between gap-2">
            <img
              src="/earn.svg"
              className="w-5 h-5 md:w-[2vw] md:h-[2vw] md:mx-2"
              alt="earn"
            />
            <span className="text-sm md:text-[1vw]">Earn</span>
          </div>
          <img src="/arrowright.svg" alt="" />
        </div>
        <div
          className="bg-white shadow-sm w-full h-20 rounded-2xl p-3 flex justify-between items-center gap-2"
          onClick={() => {
            setRedraw(false);
            setHow(false);
            setApply(true);
            setShowLevel(false);
          }}
        >
          <div className="flex flex-col items-center justify-between gap-2">
            <img
              src="/Redeem.svg"
              className="w-5 h-5 md:w-[2vw] md:h-[2vw] md:mx-1"
              alt="redeem"
            />
            <span className="text-sm md:text-[1vw]">Redeem</span>
          </div>
          <img src="/arrowright.svg" alt="" />
        </div>
      </div>
      <div
        className="bg-white shadom-sm w-[96%] ml-2 md:ml-0 md:w-full h-24 pt-6 rounded-2xl p-2 flex justify-between items-center"
        onClick={() => {
          setRedraw(false);
          setHow(false);
          setApply(false);
          setShowLevel(true);
        }}
      >
        <div className="flex flex-col justify-between w-full">
          <h2 className="text-sm md:text-[1.2vw]">
            {(profile ? profile.level : "Gold") + " (Level)"}
          </h2>
          <h3 className="text-xs text-gray-400 md:text-[1vw]">{nextText}</h3>
          <div className="my-2 w-full">
            <ProgressBar percent={displayPercent} />
          </div>
        </div>
        <img className="mb-9" src="/arrowright.svg" alt="" />
      </div>
      <div className="bg-white w-full h-full shadom-sm rounded-2xl p-3 flex flex-col md:justify-between items-start px-4 pt-6 pb-18">
        <div className="w-full flex flex-col justify-center gap-2">
          <h2 className="text-sm 2xl:text-xl md:text-[1.5vw]">
            Refer Your friends and Earn
          </h2>
          <span>
            <p className="inline">&#10004;</p>
            <h2 className="text-xs md:text-[1vw] inline pl-3 text-gray-400">
              Pro Partnership status
            </h2>
          </span>
          <span>
            <p className="inline">&#10004;</p>
            <h2 className="text-xs md:text-[1vw] inline pl-3 text-gray-400">
              All Ads stays promoted for a month
            </h2>
          </span>
          <span>
            <p className="inline">&#10004;</p>
            <h2 className="text-xs md:text-[1vw] inline pl-3 text-gray-400">
              Share unlimited number of Ads
            </h2>
          </span>
          <span>
            <p className="inline">&#10004;</p>
            <h2 className="text-xs md:text-[1vw] inline pl-3 text-gray-400">
              Boost your business
            </h2>
          </span>
        </div>
        <div className=" mt-10 md:mt-5 w-full">
          <h2 className="text-xs md:text-[1vw] text-gray-400">
            You've referred 0 friends
          </h2>
          <div className="flex gap-2 items-center justify-between w-full">
            <div className="p-2 rounded-lg mt-3 relative flex flex-row gap-3 justify-center border border-[var(--div-border)] items-center w-full">
              <input
                type="text"
                value={profile?.referral_code ?? ""}
                readOnly
                placeholder="No referral code"
                className="focus:outline-none rounded text-md ml-3 md:text-[2vw]"
              />
              <CopyButton
                value={profile?.referral_code ?? ""}
                timeout={2000}
                className="absolute right-1 top-1 md:right-1 md:top-0.5  md:px-6 hover:text-gray-500 hover:cursor-pointer bg-[var(--div-active)] rounded-lg px-3 py-1.5 justify-center"
              />
            </div>
          </div>
          <div className="w-full h-5" />
        </div>
      </div>
    </div>
  );
  const How = () => (
    <div className="h-full md:min-h-[92vh] md:overflow-auto no-scrollbar w-full px-8 py-9 bg-white rounded-2xl flex flex-col gap-1 items-start">
      <div>
        <h2 className="text-sm md:text-[1.2vw]">We value friendship</h2>
        <h2 className="text-xs text-gray-400 md:text-[1vw]">
          Follow the steps below and get rewarded
        </h2>
      </div>
      <div className="w-full flex -ml-13 justify-start gap-4 p-12">
        <img src="/steps.svg" alt="" className="w-10 h-auto ml-5" />
        <div className="flex flex-col justify-evenly gap-6 mb-0">
          <div className="inline whitespace-nowrap">
            <h2 className="text-xs inline text-gray-600 md:text-[1vw]">
              Share your code{" "}
            </h2>
            <img
              src="/copy.svg"
              className="inline w-3 h-auto copy"
              alt=""
              onClick={() => {
                navigator.clipboard.writeText(profile?.referral_code ?? "");
                const el = document.querySelector<HTMLImageElement>(".copy");
                if (el) {
                  el.classList.add("copied");
                  setTimeout(() => {
                    el.classList.remove("copied");
                  }, 4000);
                }
              }}
            />
          </div>
          <h2 className="text-xs text-gray-600 md:text-[1vw]">
            Your friend adds the code
          </h2>
          <h2 className="text-xs text-gray-600 md:text-[1vw]">
            Your friend places an order
          </h2>
        </div>
      </div>
      <div className="flex flex-col gap-4">
        <div className="flex gap-8 justify-start items-center">
          <img
            src="/earn.svg"
            alt=""
            className="w-6 h-6 md:w-[2vw] md:h-[2vw]"
          />
          <div>
            <h2 className="text-sm text-gray-400 md:text-[1.2vw]">You get</h2>
            <h2 className="text-xs md:text-[1vw]">50 Points</h2>
          </div>
        </div>
        <div className="flex gap-8 justify-start items-center">
          <img
            src="/Redeem.svg"
            alt=""
            className="w-6 h-6 md:w-[2vw] md:h-[2vw]"
          />
          <div>
            <h2 className="text-sm text-gray-400 md:text-[1.2vw]">They get</h2>
            <h2 className="text-xs md:text-[1vw]">Discount coupon 10 points</h2>
          </div>
        </div>
      </div>
    </div>
  );
  const Redraw = () => (
    <div className="h-full md:min-h-[92vh] md:overflow-auto no-scrollbar w-full px-8 bg-white rounded-2xl flex flex-col gap-6">
      <RedrawInner />
      <div>
        <div className="pb-3 text-center">
          <p className="text-xs ">Payment</p>
          <p className="text-xs text-gray-400">Recent transactions</p>
        </div>

        <div className="w-full overflow-hidden py-6 flex items-center justify-center">
          <p className="text-sm text-gray-500">No redrawal made</p>
        </div>
      </div>
    </div>
  );
  function RedrawInner() {
    const { redeem, isError, data, error } = useRedeemPoints();
    const [isLoading, setIsLoading] = useState(false);

    const handleRedeem = async () => {
      if (redeemableBlocks === 0) return;
      setIsLoading(true);
      try {
        await redeem();
        // refresh profile so UI updates; call refetchProfile if available
        if (typeof refetchProfile === 'function') await refetchProfile();
        toast.success(`Redeemed GH₵${redeemableGhc.toLocaleString()}`);
      } catch {
        toast.error('Redeem failed. Please try again.');
      } finally {
        setIsLoading(false);
      }
    };

    return (
      <div className="flex items-center p-3 mt-4 flex-col">
        <p className="text-4xl">{`₵ ${equivalentGhcExact.toFixed(2)}`}</p>
        <div className="w-4/5" title={redrawTooltip}>
          <Button
            name={isLoading ? "Processing..." : "Redraw"}
            disabled={redeemableBlocks === 0 || isLoading}
            onClick={handleRedeem}
          />
        </div>
        <div className="mt-2">
          {isError && (
            <p className="text-sm text-red-500">
              {error?.message ?? "Redeem failed"}
            </p>
          )}
          {data && (
            <p className="text-sm text-green-600">
              Redeemed GH₵{Number(data.cash_amount).toLocaleString()} —
              remaining points: {data.remaining_points}
            </p>
          )}
        </div>
      </div>
    );
  }
  const Apply = () => {
    const [code, setCode] = useState("");
    const { apply, isLoading, isError, data, error } = useApplyCoupon();

    const handleApply = async () => {
      if (!code) return;
      try {
        await apply(code);
        toast.success('Coupon applied successfully');
        setCode("");
      } catch {
        toast.error('Failed to apply coupon');
      }
    };

    return (
      <div className="h-full md:min-h-[92vh] md:overflow-auto no-scrollbar w-full rounded-2xl flex flex-col gap-2">
        <div className="bg-white w-full shadom-sm h-56 rounded-2xl pt-8 p-5 flex flex-col justify-between items-start gap-6">
          <div className="flex gap-2 text-sm">
            <img src="/Redeem.svg" alt="" className="w-5 h-5" />
            <h2 className="inline">Apply Coupon</h2>
          </div>
          <div className="flex justify-between w-full text-xs text-gray-600">
            <h2>Get Cash equivalent</h2>
            <h2>
              {data && typeof data.discount_value !== "undefined"
                ? `GH₵${Number(data.discount_value).toLocaleString()}`
                : "₵0"}
            </h2>
          </div>
          <div className="relative flex flex-row gap-3 justify-center items-center">
            <input
              type="text"
              value={code}
              onChange={(e) => setCode(e.target.value)}
              className="bg-[#F9F9F9] p-3 rounded-lg w-full"
              placeholder="Add code here"
            />
            <button
              className="absolute right-1 top-1 bg-white rounded-lg px-3 py-2"
              onClick={handleApply}
              disabled={isLoading || !code}
            >
              {isLoading ? "Applying..." : "Apply"}
            </button>
          </div>
          <div className="w-full mt-0">
            {isError && (
              <p className="text-sm text-red-500">
                {error?.message ?? "Failed to apply coupon"}
              </p>
            )}
            {data && (
              <p className="text-sm text-green-600">
                Coupon {data.code} applied — discount: {data.discount_type}{" "}
                {data.discount_value}
              </p>
            )}
          </div>
        </div>
      </div>
    );
  };
  const Level = () => (
    <div className="w-full px-3 h-full bg-white shadom-sm rounded-2xl pt-4 pb-18">
      <div className="w-full h-full flex flex-col md:justify-center gap-2 md:py-8">
        <div className=" flex rounded-lg flex-col justify-between bg-[#F9F9F9] p-3">
          <h2 className="text-sm">Silver</h2>
          <h3 className="text-xs text-gray-500">
            {remainingToGold.toLocaleString()} points to gold
          </h3>
          <div className="my-2 w-full">
            <ProgressBar percent={silverPercent} />
          </div>
        </div>
        <div className=" flex flex-col rounded-lg justify-between bg-[#F9F9F9] p-3">
          <h2 className="text-sm">{"Gold"}</h2>
          <h3 className="text-xs text-gray-500">
            {remainingToDiamond.toLocaleString()} points to diamond
          </h3>
          <div className="my-2 w-full">
            <ProgressBar percent={goldPercent} />
          </div>
        </div>
        <div className=" flex flex-col rounded-lg justify-between bg-[#F9F9F9] p-3">
          <h2 className="text-sm">Diamond</h2>
          <h3 className="text-xs text-gray-500">{diamondPointsText}</h3>
          <div className="my-2 w-full">
            <ProgressBar percent={diamondPercent} />
          </div>
        </div>
        <h2 className="text-xs text-gray-500">
          Your earning levels also helps us to rank you.
        </h2>
      </div>
    </div>
  );

  return (
    <div className="h-screen max-sm:w-screen lg:w-full max-lg:w-full bg-[var(--background)] mb-5 relative">
      <div className="w-full md:grid md:grid-cols-2 py-5 md:py-[3.5vh] h-full overflow-hidden gap-4">
        <Refer />
        <div className="md:w-full md:overflow-auto no-scrollbar">
          <div className="hidden md:h-full md:block md:min-h-[94vh]">
            {how ? (
              <How />
            ) : apply ? (
              <Apply />
            ) : redraw ? (
              <Redraw />
            ) : showLevel ? (
              <Level />
            ) : null}
            <div className="w-full h-17" />
          </div>
        </div>
      </div>

      {(how || apply || redraw || showLevel) && (
        <div className="fixed inset-0 bg-white z-50 flex flex-col md:hidden animate-fadeIn">
          <div className="flex items-center gap-3 p-4 border-b border-gray-200">
            <button
              onClick={() => {
                setHow(false);
                setApply(false);
                setRedraw(false);
                setShowLevel(false);
              }}
              className="flex items-center gap-1 text-gray-600 hover:text-gray-900 transition-colors"
            >
              <img src="/arrowleft.svg" alt="back" className="w-5 h-5" />
              <span className="text-sm font-medium">Back</span>
            </button>
          </div>

          <div className="flex-1 overflow-y-auto p-4">
            {how ? (
              <How />
            ) : apply ? (
              <Apply />
            ) : redraw ? (
              <Redraw />
            ) : showLevel ? (
              <Level />
            ) : null}
          </div>
        </div>
      )}

      <MenuButton />
    </div>
  );
};

export default ReferPage;
