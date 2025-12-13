import React from "react";
import type { Product } from "../../../types/Product";

interface SellerInfoProps {
  owner: any;
  currentAdData?: Product | any;
  sellerProducts: any[];
  setSellerModalImage: (img: string | null) => void;
  setIsSellerModalOpen: (open: boolean) => void;
  sellerCarouselRef: React.RefObject<HTMLDivElement | null>;
  navigate: (path: string, options?: any) => void;
  setIsSellerAdsModalOpen: (open: boolean) => void;
}

const SellerInfo: React.FC<SellerInfoProps> = ({
  owner,
  currentAdData,
  sellerProducts,
  setSellerModalImage,
  setIsSellerModalOpen,
  sellerCarouselRef,
  navigate,
  setIsSellerAdsModalOpen,
}) => (
  <div className="sm:mt-4">
    <div className="hidden sm:flex flex-row gap-4 bg-(--div-active) px-4 py-7 rounded-2xl mb-5">
      <div className="relative">
        <img
          src={owner?.avatar || owner?.business_logo || "/userPfp2.jpg"}
          alt={owner?.name || "Seller"}
          role="button"
          tabIndex={0}
          onClick={() => {
            setSellerModalImage(
              owner?.avatar || owner?.business_logo || "/userPfp2.jpg",
            );
            setIsSellerModalOpen(true);
          }}
          onKeyDown={(e) => {
            if (e.key === "Enter" || e.key === " ") {
              setSellerModalImage(
                owner?.avatar || owner?.business_logo || "/userPfp2.jpg",
              );
              setIsSellerModalOpen(true);
            }
          }}
          className="w-15 h-15 md:w-[5vw] md:h-[5vw] rounded-full cursor-pointer"
        />
        {owner?.business_logo && (
          <img
            src={owner?.business_logo}
            alt={`${owner?.name || "Seller"} business logo`}
            className="absolute -bottom-1 -right-2 w-8 h-8 md:w-[3vw] md:h-[3vw] rounded-full object-cover bg-white cursor-pointer"
            onClick={() => {
              setSellerModalImage(
                owner?.business_logo || owner?.avatar || "/userPfp2.jpg",
              );
              setIsSellerModalOpen(true);
            }}
            onKeyDown={(e) => {
              if (e.key === "Enter" || e.key === " ") {
                setSellerModalImage(
                  owner?.business_logo || owner?.avatar || "/userPfp2.jpg",
                );
                setIsSellerModalOpen(true);
              }
            }}
          />
        )}
      </div>
      <div>
        <h2 className="text-sm text-gray-500 md:text-[1vw]">
          {currentAdData?.created_at
            ? new Date(currentAdData.created_at).toLocaleString(undefined, {
                month: "short",
                year: "numeric",
              })
            : ""}
        </h2>
        <h3 className="font-semibold md:text-[1.2vw]">
          {owner?.name ?? "Seller"}
        </h3>
        <h3 className="text-sm text-gray-600 md:text-[1vw]">
          Total Ads: {sellerProducts.length}
        </h3>
      </div>
    </div>

    <div className="flex items-center justify-between px-2 md:mb-6">
      <div className="flex items-start gap-2 flex-col max-sm:p-4">
        <h4 className="text-xl md:text-[1.5vw]">
          {currentAdData?.owner?.business_name ?? "Seller"}
        </h4>
        <div className="flex bg-green-300 px-1 p-0.5 rounded items-center gap-1">
          <img src="/tick.svg" alt="" className="w-3 h-3" />
          <span className="text-[10px] md:text-[0.9vw] text-green-800">
            {(() => {
              const ownerLevel = (owner as unknown as { level?: string })
                ?.level as string | undefined;
              if (ownerLevel) return ownerLevel;
              return "High level";
            })()}
          </span>
        </div>
      </div>
      <button
        onClick={() => setIsSellerAdsModalOpen(true)}
        className="px-2 py-1 whitespace-nowrap rounded text-sm md:text-[1vw] bg-(--div-active) hover:bg-gray-200 cursor-pointer"
      >
        Seller Ads
      </button>
    </div>

    <div className="flex items-center justify-center mb-4 w-full">
      <div className="md:pt-4 overflow-x-hidden w-full">
        <div className="relative flex items-center justify-center gap-2 w-full max-sm:p-4 max-sm:pt-0">
          <button
            className="absolute left-1 bg-gray-100 p-1 rounded-full hover:bg-gray-300"
            onClick={() => {
              if (sellerCarouselRef.current) {
                sellerCarouselRef.current.scrollBy({
                  left: -500,
                  behavior: "smooth",
                });
              }
            }}
            aria-label="Scroll seller products left"
          >
            <img src="/arrowleft.svg" alt="" className="w-4 h-4" />
          </button>
          <div
            ref={sellerCarouselRef}
            className="flex gap-2 overflow-x-auto flex-1 no-scrollbar p-"
          >
            {sellerProducts && sellerProducts.length > 0 ? (
              sellerProducts.slice(0, 6).map(
                (p) =>
                  !p.is_taken &&
                  p.status === "ACTIVE" && (
                    <img
                      key={p.id}
                      src={p.image || "/no-image.jpeg"}
                      alt={p.name || "Seller product"}
                      role="button"
                      tabIndex={0}
                      onClick={() => {
                        navigate(`/ads/${p.id}`, { state: { adData: p } });
                      }}
                      onKeyDown={(e) => {
                        if (e.key === "Enter" || e.key === " ") {
                          navigate(`/ads/${p.id}`, { state: { adData: p } });
                        }
                      }}
                      className="bg-(--div-active) w-23 h-23 object-cover rounded shrink-0 cursor-pointer"
                    />
                  ),
              )
            ) : (
              <>
                <p className="text-gray-500 md:text-[1vw] w-full text-center">
                  No other ads from this seller.
                </p>
              </>
            )}
          </div>
          <button
            className="absolute right-1 bg-gray-100 p-1 rounded-full hover:bg-gray-300"
            onClick={() => {
              if (sellerCarouselRef.current) {
                sellerCarouselRef.current.scrollBy({
                  left: 500,
                  behavior: "smooth",
                });
              }
            }}
            aria-label="Scroll seller products right"
          >
            <img src="/arrowright.svg" alt="" className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>

    <div className="sm:hidden flex flex-row gap-4 bg-(--div-active) p-4 mb-5 w-full mx-auto">
      <div className="relative">
        <img
          src={
            currentAdData?.owner?.avatar ||
            currentAdData?.owner?.business_logo ||
            "/userPfp2.jpg"
          }
          alt={currentAdData?.owner?.name || "Seller"}
          role="button"
          tabIndex={0}
          onClick={() => {
            setSellerModalImage(
              currentAdData?.owner?.avatar ||
                currentAdData?.owner?.business_logo ||
                "/userPfp2.jpg",
            );
            setIsSellerModalOpen(true);
          }}
          onKeyDown={(e) => {
            if (e.key === "Enter" || e.key === " ") {
              setSellerModalImage(
                currentAdData?.owner?.avatar ||
                  currentAdData?.owner?.business_logo ||
                  "/userPfp2.jpg",
              );
              setIsSellerModalOpen(true);
            }
          }}
          className="w-15 h-15 rounded-full cursor-pointer"
        />
        {currentAdData?.owner?.business_logo && (
          <img
            src={currentAdData?.owner?.business_logo}
            alt={`${currentAdData?.owner?.name || "Seller"} business logo`}
            className="absolute -bottom-1 -right-2 w-8 h-8 rounded-full object-cover bg-white cursor-pointer"
            onClick={() => {
              setSellerModalImage(
                currentAdData?.owner?.business_logo ||
                  currentAdData?.owner?.avatar ||
                  "/userPfp2.jpg",
              );
              setIsSellerModalOpen(true);
            }}
          />
        )}
      </div>
      <div>
        <h2 className="text-sm text-gray-500">
          {currentAdData?.created_at
            ? new Date(currentAdData.created_at).toLocaleString(undefined, {
                month: "short",
                year: "numeric",
              })
            : ""}
        </h2>
        <h3 className="font-semibold">
          {currentAdData?.owner?.name ?? "Seller"}
        </h3>
        <h3 className="text-sm text-gray-600">
          Total Ads: {sellerProducts.length || 0}
        </h3>
      </div>
    </div>
  </div>
);

export default React.memo(SellerInfo);
