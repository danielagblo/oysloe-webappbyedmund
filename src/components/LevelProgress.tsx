import React from "react";
import { LEVELS } from "../constants/levels";
import useUserProfile from "../features/userProfile/useUserProfile";
import ProgressBar from "./ProgressBar";

interface LevelProgressProps {
  silverPercent?: number;
  goldPercent?: number;
  diamondPercent?: number;
  remainingToGold?: number;
  remainingToDiamond?: number;
  diamondPointsText?: string;
  compact?: boolean;
  className?: string;
  fullHeight?: boolean;
}

const LevelProgress: React.FC<LevelProgressProps> = ({
  silverPercent,
  goldPercent,
  diamondPercent,
  remainingToGold,
  remainingToDiamond,
  diamondPointsText,
  compact = false,
  className = "",
  fullHeight = true,
}) => {
  // If caller didn't provide values, compute them from the profile
  const { profile } = useUserProfile();
  const points = Number((profile as any)?.referral_points ?? 0) || 0;

  // Level thresholds (centralized)
  const THRESHOLDS = {
    silver: LEVELS.silverStart,
    gold: LEVELS.goldStart,
    diamond: LEVELS.diamondStart,
  } as const;

  // compute values only when props are undefined
  const computedRemainingToGold =
    remainingToGold ?? Math.max(0, THRESHOLDS.gold - points);
  const computedRemainingToDiamond =
    remainingToDiamond ?? Math.max(0, THRESHOLDS.diamond - points);

  let computedSilverPercent: number;
  if (typeof silverPercent === "number") computedSilverPercent = silverPercent;
  else {
    computedSilverPercent = Math.round(
      (points / Math.max(1, THRESHOLDS.gold)) * 100,
    );
    if (!isFinite(computedSilverPercent) || computedSilverPercent < 0)
      computedSilverPercent = 0;
    if (computedSilverPercent > 100) computedSilverPercent = 100;
  }

  let computedGoldPercent: number;
  if (typeof goldPercent === "number") computedGoldPercent = goldPercent;
  else {
    computedGoldPercent = Math.round(
      ((points - THRESHOLDS.gold) /
        Math.max(1, THRESHOLDS.diamond - THRESHOLDS.gold)) *
        100,
    );
    if (!isFinite(computedGoldPercent) || computedGoldPercent < 0)
      computedGoldPercent = 0;
    if (computedGoldPercent > 100) computedGoldPercent = 100;
  }

  let computedDiamondPercent: number;
  if (typeof diamondPercent === "number")
    computedDiamondPercent = diamondPercent;
  else {
    computedDiamondPercent = Math.round(
      (points / Math.max(1, LEVELS.diamondTop)) * 100,
    );
    if (!isFinite(computedDiamondPercent) || computedDiamondPercent < 0)
      computedDiamondPercent = 0;
    if (computedDiamondPercent > 100) computedDiamondPercent = 100;
  }

  const computedDiamondPointsText =
    diamondPointsText ?? `${points.toLocaleString()} points`;
  const rootClass = `${className} w-full rounded-2xl`;
  const paddingClass = "flex flex-col justify-center items-center px-2";
  const listClass =
    "w-full flex flex-col md:justify-between gap-1" +
    (fullHeight ? " h-full" : "");
  const cardPadding = compact ? "p-2 rounded-md" : "p-3 rounded-lg";
  const cardHeightClass = !compact && fullHeight ? "h-1/3" : "";

  return (
    <div
      className={`${rootClass} ${paddingClass} ${fullHeight ? "h-full" : ""} flex flex-col justify-center items-center`}
    >
      <div className={listClass}>
        <div className="px-2">
          <h2 className={`text-[1.25vw] font-semibold max-lg:text-lg`}>
            Earning track
          </h2>
        </div>
        <div className="flex flex-col gap-2 max-sm:gap-4 w-full h-full justify-evenly">
          <div
            className={`bg-[#F9F9F9] ${cardPadding} flex flex-col justify-between shadow-xs ${cardHeightClass}`}
          >
            <h2 className="text-[1vw] max-lg:text-base">Silver</h2>
            <h3 className="text-[0.9vw] text-gray-500 max-lg:text-sm">
              {computedRemainingToGold.toLocaleString()} points to gold
            </h3>
            <div className="my-2 w-full">
              <ProgressBar percent={computedSilverPercent} />
            </div>
          </div>
          <div
            className={`bg-[#F9F9F9] ${cardPadding} flex flex-col justify-between ${cardHeightClass}`}
          >
            <h2 className="text-[1vw] max-lg:text-base">Gold</h2>
            <h3 className="text-[0.9vw] text-gray-500 max-lg:text-sm">
              {computedRemainingToDiamond.toLocaleString()} points to diamond
            </h3>
            <div className="my-2 w-full">
              <ProgressBar percent={computedGoldPercent} />
            </div>
          </div>
          <div
            className={`bg-[#F9F9F9] ${cardPadding} flex flex-col justify-between shadow-xs ${cardHeightClass}`}
          >
            <h2 className="text-[1vw] max-lg:text-base">Diamond</h2>
            <h3 className="text-[0.9vw] text-gray-500 max-lg:text-sm">
              {computedDiamondPointsText}
            </h3>
            <div className="my-1 w-full">
              <ProgressBar percent={computedDiamondPercent} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LevelProgress;
