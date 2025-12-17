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
    },
    ref,
  ) => {
    const [open, setOpen] = useState(false);
    const [viewSub, setViewSub] = useState(false);
    const [submenuOptions, setSubmenuOptions] = useState<string[]>([]);
    const [selectedMain, setSelectedMain] = useState<string>("");
    const [finalLabel, setFinalLabel] = useState(triggerLabel);

    useImperativeHandle(ref, () => ({
      open: (forceSubView?: boolean) => {
        setViewSub(!!forceSubView);
        setOpen(true);
      },
    }));

    useEffect(() => {
      setFinalLabel(triggerLabel);
    }, [triggerLabel]);

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
                onClick={() => {
                  setOpen(false);
                  setViewSub(false);
                }}
              >
                <p className="rotate-45 text-[var(--dark-def)] font-bold text-3xl">
                  +
                </p>
              </button>
            </div>

            <div className="flex flex-col max-h-[60vh] overflow-y-auto scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-transparent">
              {viewSub ? (
                subLoading ? (
                  <p className="py-2 px-2 text-sm text-gray-500">Loading...</p>
                ) : (subOptions ?? submenuOptions)?.length ? (
                  (subOptions ?? submenuOptions).map((opt, i) => (
                    <button
                      key={i}
                      onClick={() => handleSubSelect(opt)}
                      className={`w-full text-left py-2 px-2 text-sm hover:bg-gray-100 relative ${
                        i !== (subOptions ?? submenuOptions).length - 1
                          ? "after:content-[''] after:absolute after:right-0 after:bottom-0 after:h-[1px] after:w-full after:bg-[var(--div-border)]"
                          : ""
                      }`}
                    >
                      {opt}
                    </button>
                  ))
                ) : (
                  <p className="py-2 px-2 text-sm text-gray-500">No options available.</p>
                )
              ) : Array.isArray(options) ? (
                options.map((opt, i) => (
                  <button
                    key={i}
                    onClick={() => handleMainSelect(opt)}
                    className={`w-full text-left py-2 px-2 text-sm hover:bg-gray-100 relative ${
                      i !== options.length - 1
                        ? "after:content-[''] after:absolute after:right-0 after:bottom-0 after:h-[1px] after:w-full after:bg-[var(--div-border)]"
                        : ""
                    }`}
                  >
                    {opt}
                  </button>
                ))
              ) : (
                Object.keys(options).map((main, i) => (
                  <button
                    key={i}
                    onClick={() => handleMainSelect(main)}
                    className={`w-full text-left py-2 px-2 text-sm hover:bg-gray-100 relative ${
                      i !== Object.keys(options).length - 1
                        ? "after:content-[''] after:absolute after:right-0 after:bottom-0 after:h-[1px] after:w-full after:bg-[var(--div-border)]"
                        : ""
                    }`}
                  >
                    {main}
                  </button>
                ))
              )}
            </div>
          </div>
        </>
      )}
    </div>
  );
},
);

DropdownPopup.displayName = "DropdownPopup";
export default DropdownPopup;
