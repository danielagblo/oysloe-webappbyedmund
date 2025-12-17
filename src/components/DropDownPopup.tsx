import { useEffect, useState, forwardRef, useImperativeHandle } from "react";

interface DropdownPopupProps {
  triggerLabel: string;
  options: string[] | Record<string, string[]>;
  onSelect: (option: string) => void;
  supportsSubmenu?: boolean;
  title?: string;
  subTitle?: string;
  subOptions?: string[];
  subLoading?: boolean;
  onMainSelect?: (option: string) => void; // optional callback when main option selected
  onSubSelect?: (option: string, mainOption?: string) => void; // optional callback when sub option selected
  initialSubView?: boolean; // open directly to sub view when true
  truncate?: boolean;
  setLocation?: React.Dispatch<React.SetStateAction<string | null>>;
  onBack?: () => void; // optional back action for parent-driven navigation
  useBottomSheetOnMobile?: boolean; // render as bottom sheet on max-sm breakpoints
  getMainOptionIcon?: (option: string) => string | null; // optional icon resolver for main options
}

export interface DropdownPopupHandle {
  open: (forceSubView?: boolean) => void;
}

const DropdownPopup = forwardRef<DropdownPopupHandle, DropdownPopupProps>(
  (
    {
      triggerLabel,
      options,
      onSelect,
      supportsSubmenu = false,
      title = "Select an Option",
      subTitle,
      subOptions,
      subLoading = false,
      onMainSelect,
      onSubSelect,
      initialSubView = false,
      truncate = false,
      setLocation,
      onBack,
      useBottomSheetOnMobile = false,
      getMainOptionIcon,
    },
    ref,
  ) => {
    const [open, setOpen] = useState(false);
    const [viewSub, setViewSub] = useState(false);
    const [submenuOptions, setSubmenuOptions] = useState<string[]>([]);
    const [selectedMain, setSelectedMain] = useState<string>("");
    const [finalLabel, setFinalLabel] = useState(triggerLabel);
    const [isMobileSheet, setIsMobileSheet] = useState(() => {
      if (!useBottomSheetOnMobile || typeof window === "undefined") return false;
      return window.matchMedia("(max-width: 640px)").matches;
    });
    const [dragStartY, setDragStartY] = useState(0);
    const [dragOffset, setDragOffset] = useState(0);

    useImperativeHandle(ref, () => ({
      open: (forceSubView?: boolean) => {
        setViewSub(!!forceSubView);
        setOpen(true);
      },
    }));

    useEffect(() => {
      setFinalLabel(triggerLabel);
    }, [triggerLabel]);

    useEffect(() => {
      if (!useBottomSheetOnMobile) {
        setIsMobileSheet(false);
        return () => void 0;
      }

      const mql = window.matchMedia("(max-width: 640px)");
      const update = () => setIsMobileSheet(mql.matches);
      update();
      mql.addEventListener("change", update);
      return () => mql.removeEventListener("change", update);
    }, [useBottomSheetOnMobile]);

    const handleMainSelect = (mainOption: string) => {
      const hasSubOptionsProp = Array.isArray(subOptions);
      const canDrillDown = supportsSubmenu || hasSubOptionsProp || (!Array.isArray(options) && supportsSubmenu);

      if (canDrillDown && !Array.isArray(options)) {
        const subs = options[mainOption];
        if (subs && subs.length > 0) setSubmenuOptions(subs);
      }

      setSelectedMain(mainOption);
      setFinalLabel(mainOption);
      onMainSelect?.(mainOption);

      if (canDrillDown) {
        setViewSub(true);
      } else {
        onSelect(mainOption);
        setOpen(false);
        try {
          setLocation?.(mainOption);
        } catch {
          // ignore
        }
      }
    };

    const handleSubSelect = (subOption: string) => {
      if (onSubSelect) {
        onSubSelect(subOption, selectedMain);
        setFinalLabel(subOption);
      } else if (supportsSubmenu && !Array.isArray(options) && submenuOptions.length > 0) {
        const combined = `${selectedMain} - ${subOption}`;
        onSelect(combined);
        setFinalLabel(combined);
      } else {
        onSelect(subOption);
        setFinalLabel(subOption);
      }

      setViewSub(false);
      setOpen(false);
      try {
        setLocation?.(subOption);
      } catch {
        // ignore
      }
    };

    const renderOptions = (isSubView: boolean) => {
      if (isSubView) {
        if (subLoading) {
          return <p className="py-2 px-2 text-sm text-gray-500">Loading...</p>;
        }
        const list = (subOptions ?? submenuOptions) || [];
        if (!list.length)
          return <p className="py-2 px-2 text-sm text-gray-500">No options available.</p>;

        return list.map((opt, i) => (
          <button
            type="button"
            key={i}
            onClick={() => handleSubSelect(opt)}
            className={`w-full text-left py-2 px-2 max-sm:py-3 text-sm hover:bg-gray-100 relative ${
              i !== list.length - 1
                ? "after:content-[''] after:absolute after:right-0 after:bottom-0 after:h-[1px] after:w-full after:bg-[var(--div-border)]"
                : ""
            }`}
          >
            {opt}
          </button>
        ));
      }

      if (Array.isArray(options)) {
        return options.map((opt, i) => (
          <button
            type="button"
            key={i}
            onClick={() => handleMainSelect(opt)}
            className={`w-full text-left py-2 px-2 text-sm hover:bg-gray-100 relative ${
              i !== options.length - 1
                ? "after:content-[''] after:absolute  max-sm:py-3 after:right-0 after:bottom-0 after:h-[1px] after:w-full after:bg-[var(--div-border)]"
                : ""
            }`}
          >
            <span className="flex items-center gap-3">
              {!isSubView && getMainOptionIcon ? (
                <img
                  src={getMainOptionIcon(opt) || ""}
                  alt=""
                  className="w-6 h-6 object-contain"
                  onError={(e) => {
                    const target = e.currentTarget;
                    target.style.display = "none";
                  }}
                />
              ) : null}
              {opt}
            </span>
          </button>
        ));
      }

      return Object.keys(options).map((main, i) => (
        <button
          type="button"
          key={i}
          onClick={() => handleMainSelect(main)}
          className={`w-full text-left py-2 px-2 text-sm hover:bg-gray-100 relative ${
            i !== Object.keys(options).length - 1
              ? "after:content-[''] after:absolute  max-sm:py-3 after:right-0 after:bottom-0 after:h-[1px] after:w-full after:bg-[var(--div-border)]"
              : ""
          }`}
        >
          <span className="flex items-center gap-3">
            {!isSubView && getMainOptionIcon ? (
              <img
                src={getMainOptionIcon(main) || ""}
                alt=""
                className="w-6 h-6 object-contain"
                onError={(e) => {
                  const target = e.currentTarget;
                  target.style.display = "none";
                }}
              />
            ) : null}
            {main}
          </span>
        </button>
      ));
    };

    const handleSheetDragStart = (e: React.TouchEvent) => {
      setDragStartY(e.touches[0].clientY);
    };

    const handleSheetDragMove = (e: React.TouchEvent) => {
      if (!dragStartY) return;
      const diff = Math.max(0, e.touches[0].clientY - dragStartY);
      setDragOffset(diff);
    };

    const handleSheetDragEnd = () => {
      if (dragOffset > 80) {
        setOpen(false);
        setViewSub(false);
      }
      setDragOffset(0);
      setDragStartY(0);
    };

  return (
    <div className="relative">
      <button
        type="button"
        onClick={(e) => {
          e.stopPropagation();
          setViewSub(initialSubView || false);
          setOpen(true);
        }}
        className="relative w-full p-3 border rounded-xl max-lg:bg-white border-[var(--div-border)] text-gray-600 text-left"
      >
        <p className="block truncate pr-10 text-sm lg:text-[1vw]">
          {truncate ? finalLabel.split(" - ")[0] : finalLabel}
        </p>
        <div className="absolute right-3 top-3 py-1.5 px-1 bg-[var(--div-active)] rounded-full flex justify-center items-center">
          <svg
            className="hover:stroke-[var(--dark-def)]"
            width="9"
            height="6"
            viewBox="0 0 9 6"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M8.27393 0.511719L3.85004 4.61922L0.389925 0.312657"
              stroke="currentColor"
              strokeOpacity="1"
            />
          </svg>
        </div>
      </button>

      {open && (
        <>
          {isMobileSheet ? (
            <>
              <div
                className={`fixed inset-0 bg-black/40 z-40 sm:hidden transition-opacity duration-300 ${
                  open ? "opacity-100" : "opacity-0"
                }`}
                onClick={() => {
                  setOpen(false);
                  setViewSub(false);
                }}
              />
              <div
                className={`fixed inset-x-0 bottom-0 z-50 bg-white rounded-t-3xl shadow-xl sm:hidden transition-transform duration-300 ease-out ${
                  open ? "translate-y-0" : "translate-y-full"
                }`}
                style={{ 
                  transform: dragOffset ? `translateY(${dragOffset}px)` : undefined,
                  transition: dragOffset ? "none" : undefined
                }}
                onTouchStart={handleSheetDragStart}
                onTouchMove={handleSheetDragMove}
                onTouchEnd={handleSheetDragEnd}
              >
                <div className="flex justify-center pt-3 pb-2">
                  <div className="w-12 h-1 bg-gray-300 rounded-full" />
                </div>

                <div className="flex items-center justify-between px-4 pb-3">
                  <div className="flex items-center gap-2">
                    {viewSub ? (
                      <button
                        type="button"
                        onClick={() => {
                          setViewSub(false);
                          onBack?.();
                        }}
                        className="bg-[var(--div-active)] hover:bg-gray-200 rounded-full p-2 flex justify-center items-center"
                      >
                        <svg
                          width="12"
                          height="11"
                          viewBox="0 0 12 11"
                          fill="none"
                          xmlns="http://www.w3.org/2000/svg"
                        >
                          <path
                            d="M5.09135 10.1816L0.000443935 5.09073L5.09135 -0.000177383L5.96635 0.863459L2.36408 4.46573H11.6936V5.71573H2.36408L5.96635 9.30664L5.09135 10.1816Z"
                            fill="#646161"
                            fillOpacity="0.81"
                          />
                        </svg>
                      </button>
                    ) : null}
                    <h3 className="font-semibold text-lg text-gray-700">
                      {viewSub ? subTitle ?? selectedMain : title}
                    </h3>
                  </div>
                  <button
                    type="button"
                    onClick={() => {
                      setOpen(false);
                      setViewSub(false);
                    }}
                    className="p-2"
                  >
                    <span className="text-[var(--dark-def)] font-bold text-3xl leading-none">
                      ×
                    </span>
                  </button>
                </div>

                <div className="max-h-[70vh] overflow-y-auto px-4 pb-5 pt-1">
                  {renderOptions(viewSub)}
                </div>
              </div>
            </>
          ) : (
            <>
              <div
                className="fixed inset-0 bg-black/50 z-40"
                onClick={() => {
                  setOpen(false);
                  setViewSub(false);
                }}
              />

              <div className="fixed z-50 top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-white rounded-xl shadow-lg w-[80%] max-w-sm py-3 px-5 text-[var(--dark-def)] transition-all duration-300">
                <div className="flex justify-between items-center mb-3">
                  <div className="flex items-center gap-2">
                    {viewSub ? (
                      <button
                        type="button"
                        onClick={() => {
                          setViewSub(false);
                          onBack?.();
                        }}
                        className="bg-[var(--div-active)] hover:bg-gray-200 rounded-full p-2 flex justify-center items-center"
                      >
                        <svg
                          width="12"
                          height="11"
                          viewBox="0 0 12 11"
                          fill="none"
                          xmlns="http://www.w3.org/2000/svg"
                        >
                          <path
                            d="M5.09135 10.1816L0.000443935 5.09073L5.09135 -0.000177383L5.96635 0.863459L2.36408 4.46573H11.6936V5.71573H2.36408L5.96635 9.30664L5.09135 10.1816Z"
                            fill="#646161"
                            fillOpacity="0.81"
                          />
                        </svg>
                      </button>
                    ) : null}
                    <h3 className="font-semibold text-lg text-gray-700">
                      {viewSub ? subTitle ?? selectedMain : title}
                    </h3>
                  </div>
                  <button
                    type="button"
                    onClick={() => {
                      setOpen(false);
                      setViewSub(false);
                    }}
                  >
                    <p className="text-[var(--dark-def)] font-bold text-3xl">
                      ×
                    </p>
                  </button>
                </div>

                <div className="flex flex-col max-h-[60vh] overflow-y-auto scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-transparent">
                  {renderOptions(viewSub)}
                </div>
              </div>
            </>
          )}
        </>
      )}
    </div>
  );
},
);

DropdownPopup.displayName = "DropdownPopup";
export default DropdownPopup;
