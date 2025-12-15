import React, { useEffect, useRef } from "react";

interface BottomSheetProps {
  isOpen: boolean;
  onClose: () => void;
  title?: string;
  children: React.ReactNode;
}

const BottomSheet: React.FC<BottomSheetProps> = ({
  isOpen,
  onClose,
  title,
  children,
}) => {
  const sheetRef = useRef<HTMLDivElement>(null);
  const startYRef = useRef(0);
  const isDraggingRef = useRef(false);
  const [translateY, setTranslateY] = React.useState(0);

  useEffect(() => {
    if (!isOpen) return;

    setTranslateY(0);

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, onClose]);

  const handleDragStart = (e: React.TouchEvent) => {
    startYRef.current = e.touches[0].clientY;
    isDraggingRef.current = true;
    e.preventDefault();
  };

  const handleDragMove = (e: React.TouchEvent) => {
    if (!isDraggingRef.current) return;
    const currentY = e.touches[0].clientY;
    const diff = currentY - startYRef.current;
    
    if (diff > 0) {
      setTranslateY(diff);
    }
    e.preventDefault();
  };

  const handleDragEnd = (e: React.TouchEvent) => {
    if (!isDraggingRef.current) return;
    isDraggingRef.current = false;

    const endY = e.changedTouches[0].clientY;
    const diff = endY - startYRef.current;

    if (diff > 50) {
      onClose();
    } else {
      setTranslateY(0);
    }
    e.preventDefault();
  };

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-50 bg-black/40 max-sm:flex max-sm:flex-col max-sm:items-center mb-16 max-sm:justify-end hidden"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div
        ref={sheetRef}
        className="w-full bg-white rounded-t-3xl max-h-[75vh] overflow-hidden animate-in slide-in-from-bottom-5 duration-300 flex flex-col touch-none transition-transform"
        style={{ transform: `translateY(${translateY}px)` }}
        onTouchStart={handleDragStart}
        onTouchMove={handleDragMove}
        onTouchEnd={handleDragEnd}
      >
        {/* Drag Handle */}
        <div
          className="flex justify-center pt-3 pb-2 cursor-grab active:cursor-grabbing flex-shrink-0 select-none"
          onTouchStart={handleDragStart}
          onTouchMove={handleDragMove}
          onTouchEnd={handleDragEnd}
        >
          <div className="w-12 h-1 bg-gray-300 rounded-full" />
        </div>

        {/* Title */}
        {title && (
          <div
            className="px-4 py-3 border-b border-gray-100 cursor-grab active:cursor-grabbing flex-shrink-0 select-none"
            onTouchStart={handleDragStart}
            onTouchMove={handleDragMove}
            onTouchEnd={handleDragEnd}
          >
            <h2 className="text-sm font-semibold text-center text-gray-800 pointer-events-none">
              {title}
            </h2>
          </div>
        )}

        {/* Content */}
        <div className="p-4 overflow-y-auto flex-1 no-scrollbar">{children}</div>
      </div>
    </div>
  );
};

export default BottomSheet;
