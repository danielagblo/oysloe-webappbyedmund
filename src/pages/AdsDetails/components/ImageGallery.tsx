import React, { useCallback, useEffect, useMemo, useState } from "react";
import Watermark from "../../../components/ImageWithWatermark";

interface ImageGalleryProps {
  images: string[];
  currentIndex: number;
  imageCount: number;
  galleryScrollRef: React.RefObject<HTMLDivElement | null>;
  onSetCurrentIndex: (updater: (idx: number) => number) => void;
  onSetPictureModalIndex: (index: number) => void;
  onOpenPictureModal: () => void;
  onTouchStart: (e: React.TouchEvent) => void;
  onTouchEnd: (e: React.TouchEvent) => void;
  businessName?: string | null;
}

const ImageGallery: React.FC<ImageGalleryProps> = ({
  images,
  currentIndex,
  imageCount,
  galleryScrollRef,
  onSetCurrentIndex,
  onSetPictureModalIndex,
  onOpenPictureModal,
  onTouchStart,
  onTouchEnd,
  businessName,
}) => {
  const galleryImages = useMemo(
    () => (images.length > 0 ? images : ["/no-image.jpeg"]),
    [images],
  );
  const max = galleryImages.length;
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(max > 3);

  const checkScroll = useCallback(() => {
    if (galleryScrollRef.current) {
      const { scrollLeft, scrollWidth, clientWidth } = galleryScrollRef.current;
      setCanScrollLeft(scrollLeft > 0);
      setCanScrollRight(scrollLeft < scrollWidth - clientWidth - 10);
    }
  }, [galleryScrollRef]);

  useEffect(() => {
    const timer = setTimeout(checkScroll, 100);
    return () => clearTimeout(timer);
  }, [galleryImages, checkScroll]);

  const prevImage = (e?: React.MouseEvent) => {
    e?.stopPropagation();
    if (galleryScrollRef.current) {
      galleryScrollRef.current.scrollBy({ left: -500, behavior: "smooth" });
      setTimeout(checkScroll, 300);
    }
  };

  const nextImage = (e?: React.MouseEvent) => {
    e?.stopPropagation();
    if (galleryScrollRef.current) {
      galleryScrollRef.current.scrollBy({ left: 500, behavior: "smooth" });
      setTimeout(checkScroll, 300);
    }
  };

  const handleWheel = (e: React.WheelEvent<HTMLDivElement>) => {
    e.preventDefault();
    if (galleryScrollRef.current) {
      const scrollAmount = Math.abs(e.deltaX) > 0 ? e.deltaX : e.deltaY;
      galleryScrollRef.current.scrollBy({
        left: scrollAmount,
        behavior: "smooth",
      });
      setTimeout(checkScroll, 300);
    }
  };

  const getMainImage = () => galleryImages[currentIndex] ?? "/no-image.jpeg";

  // determine watermark size: use larger watermark on small and large screens for readability
  const viewportWidth = typeof window !== "undefined" ? window.innerWidth : 1024;
  const watermarkSize = viewportWidth >= 1024 ? ("lg" as const) : viewportWidth < 640 ? ("lg" as const) : ("md" as const);

  return (
    <div className="w-full flex justify-center my-4 sm:mb-8">
      {/* DESKTOP: show 3 side-by-side square images (carousel) */}
      <div className="hidden sm:flex w-full h-fit gap-4 items-stretch relative">
        {canScrollLeft && (
          <button
            onClick={prevImage}
            className="absolute left-2 top-1/2 bg-white rounded-full -translate-y-1/2 z-20 px-2 py-2 shadow hover:bg-gray-100"
            aria-label="Previous image"
          >
            <img src="/arrowleft.svg" alt="Previous" />
          </button>
        )}

        <div
          ref={galleryScrollRef}
          className="flex gap-4 px-4 max-w-screen mx-auto items-center overflow-x-auto overflow-y-hidden scroll-smooth no-scrollbar"
          style={{ scrollBehavior: "smooth", width: "95%" }}
          onWheel={handleWheel}
          onScroll={checkScroll}
        >
          {galleryImages.map((src, i) => {
            return (
              <div
                key={i}
                className="shrink-0 max-w-[27vw] aspect-square bg-gray-200 rounded-xl overflow-hidden flex items-center justify-center relative cursor-pointer hover:opacity-90 transition-opacity"
                onClick={() => {
                  onSetPictureModalIndex(i);
                  onOpenPictureModal();
                }}
                aria-label={`Show image ${i + 1}`}
              >
                <div
                  className="absolute inset-0 bg-cover bg-center blur-sm opacity-50"
                  style={{ backgroundImage: `url(${src})` }}
                />
                <div className="relative w-full h-full">
                  <img
                    src={src}
                    alt={`Image ${i + 1}`}
                    className="object-cover w-full h-full relative z-10"
                    onContextMenu={(e) => e.preventDefault()}
                  />
                  <Watermark businessName={businessName} size={watermarkSize} />
                </div>
              </div>
            );
          })}
        </div>

        {canScrollRight && (
          <button
            onClick={nextImage}
            className="absolute right-2 top-1/2 bg-white rounded-full -translate-y-1/2 z-20 px-2 py-2 shadow hover:bg-gray-100"
            aria-label="Next image"
          >
            <img src="/arrowright.svg" alt="Next" />
          </button>
        )}
      </div>

      {/* MOBILE: full-width swipeable image */}
      <div
        className="relative w-full max-w-3xl only-for-iphone h-64 sm:h-96 overflow-hidden  sm:hidden"
        onTouchStart={onTouchStart}
        onTouchEnd={onTouchEnd}
      >
        <div
          className="absolute inset-0 bg-cover bg-center blur-md opacity-40"
          style={{ backgroundImage: `url(${getMainImage()})` }}
        />
        <div
          className="absolute inset-0 w-[40%] left-[30%] z-30 cursor-zoom-in"
          onClick={() => {
            onSetPictureModalIndex(currentIndex);
            onOpenPictureModal();
          }}
        />
        <img
          src={getMainImage()}
          alt="Ad main"
          className="object-cover w-full h-full relative z-10"
          onContextMenu={(e) => e.preventDefault()}
        />
        <Watermark businessName={businessName} size={watermarkSize} />
        <div
          onClick={() => {
            onSetCurrentIndex((idx) => (idx - 1 + imageCount) % imageCount);
          }}
          className="absolute top-0 left-0 w-[30%] h-full z-20"
        />
        <div
          onClick={() => {
            onSetCurrentIndex((idx) => (idx + 1) % imageCount);
          }}
          className="absolute top-0 right-0 w-[30%] h-full z-20"
        />
      </div>
    </div>
  );
};

export default React.memo(ImageGallery);
