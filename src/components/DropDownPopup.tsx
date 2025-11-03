import { useState } from "react";

interface DropdownPopupProps {
  triggerLabel: string;
  options: string[] | Record<string, string[]>;
  onSelect: (option: string) => void;
  supportsSubmenu?: boolean;
  title?: string;
  truncate?: boolean;
}

export default function DropdownPopup({
  triggerLabel,
  options,
  onSelect,
  supportsSubmenu = false,
  title = "Select an Option",
  truncate = false
}: DropdownPopupProps) {
  const [open, setOpen] = useState(false);
  const [submenuOpen, setSubmenuOpen] = useState(false);
  const [submenuOptions, setSubmenuOptions] = useState<string[]>([]);
  const [selectedMain, setSelectedMain] = useState<string>("");
  const [finalLabel, setFinalLabel] = useState(triggerLabel);

  const handleMainSelect = (mainOption: string) => {
    if (supportsSubmenu && !Array.isArray(options)) {
      const subs = options[mainOption];
      if (subs && subs.length > 0) {
        setSubmenuOptions(subs);
        setSelectedMain(mainOption);
        setSubmenuOpen(true);
      } else {
        onSelect(mainOption);
        setFinalLabel(mainOption);
        setOpen(false);
      }
    } else {
      onSelect(mainOption);
      setFinalLabel(mainOption);
      setOpen(false);
    }
  };

  const handleSubSelect = (subOption: string) => {
    const combined = `${selectedMain} - ${subOption}`;
    onSelect(combined);
    setFinalLabel(combined);
    setSubmenuOpen(false);
    setOpen(false);
  };

  return (
    <div className="relative">
      
      <button
        type="button"
        onClick={(e) => {
          e.stopPropagation();
          setOpen(true);
        }}
        className="relative w-full p-3 border rounded-xl border-[var(--div-border)] text-gray-600 text-left"
      >
        <p className="max-w-[80%] truncate">
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

      {(open || submenuOpen) && (
        <>
          <div
            className="fixed inset-0 bg-black/50 z-40"
            onClick={() => {
              setOpen(false);
              setSubmenuOpen(false);
            }}
          />

          {open && !submenuOpen && (
            <div className="fixed z-50 top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-white rounded-xl shadow-lg w-[80%] max-w-sm py-3 px-5 text-[var(--dark-def)] transition-all duration-300">
              <div className="flex justify-between items-center mb-3">
                <h3 className="font-semibold text-lg text-gray-700">
                  {title}
                </h3>
                <button
                  onClick={() => {
                    setOpen(false);
                    setSubmenuOpen(false);
                  }}
                >
                  <p className="rotate-45 text-[var(--dark-def)] font-bold text-3xl">
                    +
                  </p>
                </button>
              </div>

              <div className="flex flex-col max-h-[60vh] overflow-y-auto scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-transparent">
                {Array.isArray(options)
                  ? options.map((opt, i) => (
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
                  : Object.keys(options).map((main, i) => (
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
                    ))}
              </div>
            </div>
          )}

          {submenuOpen && (
            <div className="fixed z-[60] top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-white rounded-xl shadow-lg w-[80%] max-w-sm py-3 px-5 text-[var(--dark-def)] transition-all duration-300">
              <div className="flex justify-between items-center mb-3">
                <div className="flex items-center gap-2">

                  <button
                    onClick={() => {
                      setSubmenuOpen(false);
                      setOpen(true);
                    }}
                    className="bg-[var(--div-active)] hover:bg-gray-200 rounded-full p-2 flex justify-center items-center"
                  >
                    <svg width="12" height="11" viewBox="0 0 12 11" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path d="M5.09135 10.1816L0.000443935 5.09073L5.09135 -0.000177383L5.96635 0.863459L2.36408 4.46573H11.6936V5.71573H2.36408L5.96635 9.30664L5.09135 10.1816Z" fill="#646161" fill-opacity="0.81"/>
                    </svg>

                  </button>
                  <h3 className="font-semibold text-lg text-gray-700">
                    {selectedMain}
                  </h3>
                </div>

                <button
                  onClick={() => {
                    setOpen(false);
                    setSubmenuOpen(false);
                  }}
                >
                  <p className="rotate-45 text-[var(--dark-def)] font-bold text-3xl">
                    +
                  </p>
                </button>
              </div>

              <div className="flex flex-col max-h-[60vh] overflow-y-auto scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-transparent">
                {submenuOptions.map((opt, i) => (
                  <button
                    key={i}
                    onClick={() => handleSubSelect(opt)}
                    className={`w-full text-left py-2 px-2 text-sm hover:bg-gray-100 relative ${
                      i !== submenuOptions.length - 1
                        ? "after:content-[''] after:absolute after:right-0 after:bottom-0 after:h-[1px] after:w-full after:bg-[var(--div-border)]"
                        : ""
                    }`}
                  >
                    {opt}
                  </button>
                ))}
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
}
