import React from "react";
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
}) => {
    // If caller didn't provide values, compute them from the profile
    const { profile } = useUserProfile();
    const points = Number(profile?.referral_points ?? 0) || 0;

    // Level thresholds (kept in sync with ReferPage)
    const THRESHOLDS = {
        silver: 0,
        gold: 10000,
        diamond: 100000,
    } as const;

    // compute values only when props are undefined
    const computedRemainingToGold = remainingToGold ?? Math.max(0, THRESHOLDS.gold - points);
    const computedRemainingToDiamond = remainingToDiamond ?? Math.max(0, THRESHOLDS.diamond - points);

    let computedSilverPercent: number;
    if (typeof silverPercent === "number") computedSilverPercent = silverPercent;
    else {
        computedSilverPercent = Math.round((points / Math.max(1, THRESHOLDS.gold)) * 100);
        if (!isFinite(computedSilverPercent) || computedSilverPercent < 0) computedSilverPercent = 0;
        if (computedSilverPercent > 100) computedSilverPercent = 100;
    }

    let computedGoldPercent: number;
    if (typeof goldPercent === "number") computedGoldPercent = goldPercent;
    else {
        computedGoldPercent = Math.round(
            ((points - THRESHOLDS.gold) / Math.max(1, THRESHOLDS.diamond - THRESHOLDS.gold)) * 100,
        );
        if (!isFinite(computedGoldPercent) || computedGoldPercent < 0) computedGoldPercent = 0;
        if (computedGoldPercent > 100) computedGoldPercent = 100;
    }

    let computedDiamondPercent: number;
    if (typeof diamondPercent === "number") computedDiamondPercent = diamondPercent;
    else {
        computedDiamondPercent = Math.round((points / Math.max(1, THRESHOLDS.diamond)) * 100);
        if (!isFinite(computedDiamondPercent) || computedDiamondPercent < 0) computedDiamondPercent = 0;
        if (computedDiamondPercent > 100) computedDiamondPercent = 100;
    }

    const computedDiamondPointsText = diamondPointsText ?? `${points.toLocaleString()} points`;
    const rootClass = `${className} w-full bg-white rounded-2xl`;
    const paddingClass = compact ? "px-2 pt-3 pb-6" : "px-3 pt-4 pb-18";
    const listClass = compact ? "w-full h-full flex flex-col gap-1 md:py-4" : "w-full h-full flex flex-col md:justify-center gap-2 md:py-8";
    const cardPadding = compact ? "p-2 rounded-md" : "p-3 rounded-lg";

    return (
        <div className={`${rootClass} ${paddingClass}`}>
            <div className={listClass}>
                <div className="px-2 pt-1 pb-1">
                    <h2 className={`${compact ? 'text-xs' : 'text-sm'} font-semibold`}>Earning track</h2>

                </div>
                <div className={`bg-[#F9F9F9] ${cardPadding} flex flex-col justify-between shadow-xs`}>
                    <h2 className="text-sm">Silver</h2>
                    <h3 className="text-xs text-gray-500">
                        {computedRemainingToGold.toLocaleString()} points to gold
                    </h3>
                    <div className="my-2 w-full">
                        <ProgressBar percent={computedSilverPercent} />
                    </div>
                </div>
                <div className={`bg-[#F9F9F9] ${cardPadding} flex flex-col justify-between shadow-xs`}>
                    <h2 className={`${compact ? 'text-xs' : 'text-sm'}`}>Gold</h2>
                    <h3 className={`${compact ? 'text-[10px]' : 'text-xs'} text-gray-500`}>
                        {computedRemainingToDiamond.toLocaleString()} points to diamond
                    </h3>
                    <div className="my-2 w-full">
                        <ProgressBar percent={computedGoldPercent} />
                    </div>
                </div>
                <div className={`bg-[#F9F9F9] ${cardPadding} flex flex-col justify-between shadow-xs`}>
                    <h2 className={`${compact ? 'text-xs' : 'text-sm'}`}>Diamond</h2>
                    <h3 className={`${compact ? 'text-[10px]' : 'text-xs'} text-gray-500`}>{computedDiamondPointsText}</h3>
                    <div className="my-1 w-full">
                        <ProgressBar percent={computedDiamondPercent} />
                    </div>
                </div>

            </div>
        </div>
    );
};

export default LevelProgress;
