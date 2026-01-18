import React from "react";

interface WatermarkProps {
    ownerLogo?: string | null;
    fallbackLogo?: string;
    watermarkSize?: "sm" | "md" | "lg";
}

/**
 * Watermark component to overlay on images
 * @param ownerLogo - Owner's business logo URL (optional)
 * @param fallbackLogo - Fallback logo when owner logo is not available (default: "/Logo1.svg")
 * @param watermarkSize - Size of watermark: 'sm' (32px), 'md' (48px), 'lg' (64px)
 */
const Watermark: React.FC<WatermarkProps> = ({
    ownerLogo,
    fallbackLogo = "/Logo1.svg",
    watermarkSize = "md",
}) => {
    const watermarkSizeMap = {
        xs: "w-5 h-5",
        sm: "w-8 h-8",
        md: "w-12 h-12",
        lg: "w-16 h-16",
    };

    const watermarkLogo = ownerLogo || fallbackLogo;

    if (!watermarkLogo) return null;

    return (
        <div className="absolute bottom-2 right-2 rounded-lg shadow-md z-20">
            <img
                src={watermarkLogo}
                alt="Watermark"
                className={`${watermarkSizeMap[watermarkSize]} object-contain rounded-2xl`}
                onError={(e) => {
                    // If watermark fails to load, try fallback
                    if (watermarkLogo !== fallbackLogo) {
                        (e.target as HTMLImageElement).src = fallbackLogo;
                    }
                }}
            />
        </div>
    );
};

export default Watermark;
