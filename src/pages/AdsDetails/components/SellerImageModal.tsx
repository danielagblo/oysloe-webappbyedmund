import React from "react";

interface SellerImageModalProps {
  isSellerModalOpen: boolean;
  sellerModalImage: string | null;
  setIsSellerModalOpen: (open: boolean) => void;
}

const SellerImageModal: React.FC<SellerImageModalProps> = ({
  isSellerModalOpen,
  sellerModalImage,
  setIsSellerModalOpen,
}) => {
  if (!isSellerModalOpen || !sellerModalImage) return null;
  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/70"
      onClick={() => setIsSellerModalOpen(false)}
    >
      <div
        className="relative max-w-3xl w-[95%] sm:w-[60%] bg-transparent p-4 max-h-[90vh] overflow-auto no-scrollbar flex flex-col items-center justify-center"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          className="absolute top-3 right-3 text-white bg-black/40 rounded-full p-1 z-30 hover:bg-black/60 transition"
          onClick={() => setIsSellerModalOpen(false)}
          aria-label="Close seller image"
        >
          ✕
        </button>

        <img
          src={sellerModalImage}
          alt="Seller"
          className="max-h-[80vh] object-contain w-full rounded"
        />
      </div>
    </div>
  );
};

export default React.memo(SellerImageModal);
