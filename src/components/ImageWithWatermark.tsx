import React from "react";

interface WatermarkProps {
    businessName?: string | null;
    size?: "xxs" | "xs" | "sm" | "md" | "lg";
}

/**
 * Watermark component to overlay on images
 * Designed to be hard to crop out, centered with semi-transparent text
 * Scales proportionally with the image and remains centered
 * @param businessName - Business name from the product owner
 */
const Watermark: React.FC<WatermarkProps> = ({ businessName, size = "md" }) => {
    if (!businessName) return null;

    const firstLineClass =
        size === "xxs"
            ? "text-[6px] sm:text-[7px] font-medium"
            : size === "xs"
                ? "text-[7px] sm:text-[8px] font-medium"
                : size === "sm"
                    ? "text-[8px] sm:text-[9px] font-medium"
                    : size === "lg"
                        ? "text-[12px] sm:text-[14px] font-medium"
                        : "text-[10px] sm:text-[12px] font-medium";

    const secondLineClass =
        size === "xxs"
            ? "text-[4px] sm:text-[6px] font-normal"
            : size === "xs"
                ? "text-[6px] sm:text-[8px] font-normal"
                : size === "sm"
                    ? "text-[8px] sm:text-[12px] font-normal"
                    : size === "lg"
                        ? "text-[20px] sm:text-[24px] font-normal"
                        : "text-[8px] sm:text-[12px] lg:text-[20px] font-normal";

    // adjust bottom padding for small variants so watermark stays inside small thumbnails
    const containerPbClass = size === "xxs" ? "pb-1" : size === "xs" ? "pb-2" : size === "sm" ? "pb-3" : "pb-6";

    // opacity mapping by size (larger images get higher opacity)
    const containerOpacityClass =
        size === "xxs" ? "opacity-30" : size === "xs" ? "opacity-30" : size === "sm" ? "opacity-30" : size === "md" ? "opacity-30" : "opacity-30";

    return (
        <div className={`absolute inset-0 flex items-end justify-center pointer-events-none ${containerPbClass} z-30`}>
            <div className={`text-center ${containerOpacityClass} w-full px-1`}>
                <p className={`${firstLineClass} text-gray-500 tracking-wider leading-tight mb-1 text-shadow-md text-shadow-white `}>
                    POSTED ON OYSLOE
                </p>
                <p className={`${secondLineClass} text-gray-500 tracking-widest max-w-full break-words whitespace-normal mx-auto text-shadow-md text-shadow-white`}>
                    {businessName.toUpperCase()}
                </p>
            </div>
        </div>
    );
};

export default Watermark;
