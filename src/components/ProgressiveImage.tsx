import React, { useState } from "react";
import LoadingDots from "./LoadingDots";
import Watermark from "./ImageWithWatermark";

type WatermarkSize = "xxs" | "xs" | "sm" | "md" | "lg";

type Props = {
  src: string;
  alt: string;
  containerClassName?: string;
  imgClassName?: string;
  watermarkBusinessName?: string | null;
  watermarkSize?: WatermarkSize;
  onContextMenu?: (e: React.MouseEvent) => void;
};

const ProgressiveImage: React.FC<Props> = ({
  src,
  alt,
  containerClassName,
  imgClassName,
  watermarkBusinessName,
  watermarkSize,
  onContextMenu,
}) => {
  const [loaded, setLoaded] = useState(false);

  return (
    <div className={"relative overflow-hidden " + (containerClassName || "")}> 
      <img
        src={src}
        alt={alt}
        loading="lazy"
        onLoad={() => setLoaded(true)}
        onError={() => setLoaded(true)}
        onContextMenu={onContextMenu}
        className={(imgClassName || "") + " transition-opacity duration-300 " + (loaded ? "opacity-100" : "opacity-0")}
      />
      {watermarkBusinessName ? (
        <Watermark businessName={watermarkBusinessName} size={watermarkSize || "md"} />
      ) : null}
      {!loaded ? (
        <div className="absolute inset-0 flex items-center justify-center bg-gray-100">
          <LoadingDots />
        </div>
      ) : null}
    </div>
  );
};

export default ProgressiveImage;
