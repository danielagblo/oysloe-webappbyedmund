import React from "react";
import ProgressiveImage from "../../../components/ProgressiveImage";

interface PictureModalProps {
  pageImages: string[];
  isPictureModalOpen: boolean;
  pictureModalIndex: number;
  setPictureModalIndex: (updater: (index: number) => number) => void;
  setIsPictureModalOpen: (open: boolean) => void;
  setGalleryIndex: (updater: (idx: number) => number) => void;
  businessName?: string | null;
}

const PictureModal: React.FC<PictureModalProps> = ({
  pageImages,
  isPictureModalOpen,
  pictureModalIndex,
  setPictureModalIndex,
  setIsPictureModalOpen,
  setGalleryIndex,
  businessName,
}) => {
  if (!isPictureModalOpen) return null;
  const imgs = pageImages.length > 0 ? pageImages : ["/no-image.jpeg"];
  const max = imgs.length;

  const prev = (e?: React.MouseEvent) => {
    e?.preventDefault();
    e?.stopPropagation();
    setPictureModalIndex((i) => (i - 1 + max) % max);
  };
  const next = (e?: React.MouseEvent) => {
    e?.preventDefault();
    e?.stopPropagation();
    setPictureModalIndex((i) => (i + 1) % max);
  };

  const close = () => {
    setIsPictureModalOpen(false);
    const clampStart = Math.max(0, max - 3);
    setGalleryIndex((pictureModalIndex) =>
      Math.max(0, Math.min(pictureModalIndex, clampStart)),
    );
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/70"
      onClick={close}
    >
      <div
        className="relative max-w-4xl w-[95%] sm:w-[80%] bg-transparent p-4 max-h-[90vh] overflow-auto no-scrollbar flex flex-col items-center justify-center"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          className="absolute top-3 right-3 text-white bg-black/40 rounded-full p-1 z-30 hover:bg-black/60 transition"
          onClick={(e) => {
            e.preventDefault();
            e.stopPropagation();
            close();
          }}
          aria-label="Close"
        >
          ✕
        </button>

        {max > 1 && (
          <button
            className="absolute left-2 top-1/2 -translate-y-1/2 bg-white rounded-full p-2 z-20 hover:bg-gray-100"
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              prev(e);
            }}
            aria-label="Previous"
          >
            <img src="/arrowleft.svg" alt="Prev" loading="lazy" decoding="async" />
          </button>
        )}

        <div className="relative flex items-center justify-center w-full">
          <div className="relative">
            <ProgressiveImage
              src={imgs[pictureModalIndex] ?? "/no-image.jpeg"}
              alt={`Modal image ${pictureModalIndex + 1}`}
              containerClassName="relative"
              imgClassName="max-h-[60vh] sm:max-h-[70vh] object-contain w-full  relative z-10"
              watermarkBusinessName={businessName}
              watermarkSize="lg"
              onContextMenu={(e) => e.preventDefault()}
              loading="eager"
            />
          </div>
        </div>

        {max > 1 && (
          <button
            className="absolute right-2 top-1/2 -translate-y-1/2 bg-white rounded-full p-2 z-20 hover:bg-gray-100"
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              next(e);
            }}
            aria-label="Next"
          >
            <img src="/arrowright.svg" alt="Next" loading="lazy" decoding="async" />
          </button>
        )}

        <div className="mt-4 flex gap-2 overflow-hidden py-2 rounded justify-center items-center">
          {imgs.map((s, i) => (
            <button
              key={i}
              onClick={() => setPictureModalIndex(() => i)}
              className={`shrink-0 w-20 h-20 overflow-hidden rounded ${i === pictureModalIndex ? "ring-2 ring-white" : ""}`}
            >
              <ProgressiveImage
                src={s}
                alt={`thumb ${i + 1}`}
                containerClassName="w-full h-full"
                imgClassName="object-cover w-full h-full"
                watermarkBusinessName={businessName}
                watermarkSize="xxs"
                onContextMenu={(e) => e.preventDefault()}
                width={80}
                height={80}
              />
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};

export default React.memo(PictureModal);
