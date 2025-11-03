import { useState } from "react";

interface DropdownPopupProps {
  triggerLabel: string;
  options: string[];
  onSelect: (option: string) => void;
}

export default function DropdownPopup({ triggerLabel, options, onSelect }: DropdownPopupProps) {
  const [open, setOpen] = useState(false);

  return (
    <div className="relative">
      <button
        onClick={() => setOpen(true)}
        className="relative w-full p-3 border rounded-xl border-[var(--div-border)] text-gray-400 text-left"
      >
        <p className="max-w-[80%] truncate">{triggerLabel.split(" - ")[0]}</p>
        <div className="absolute right-3 top-3 py-1.5 px-1 bg-[var(--div-active)]rounded-full flex justify-center items-center">
          <svg className="hover:stroke-[var(--dark-def)]" width="9" height="6" viewBox="0 0 9 6" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M8.27393 0.511719L3.85004 4.61922L0.389925 0.312657" stroke="currentColor" stroke-opacity="1"/>
          </svg>
        </div>

      </button>
      {open && (
        <>
          <div
            className="fixed inset-0 bg-black/50 z-40"
            onClick={() => setOpen(false)}
          />

          <div className="fixed z-50 top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-white rounded-xl shadow-lg w-[80%] max-w-sm py-3 px-5 text-[var(--dark-def)]">
            <div className="flex justify-between items-center mb-3">
              <h3 className="font-semibold text-[length:1.3vw] text-gray-700">Select an Option</h3>
              <button onClick={() => setOpen(false)}>
                <p className="rotate-45 text-[var(--dark-def)] font-bold text-5xl">+</p>
              </button>
            </div>
            <div className="flex flex-col">
              {options.map((opt, i) => (
                <button
                  key={i}
                  onClick={() => {
                    onSelect(opt);
                    setOpen(false);
                  }}
                  className={`w-full text-left py-2 px-2 text-sm hover:bg-gray-100 relative
                    ${i !== options.length - 1 ? "after:content-[''] after:absolute after:right-0 after:bottom-0 after:h-[1px] after:w-full after:bg-[var(--div-border)]" : ""}
                  `}
                >
                  {opt}
                </button>
              ))}
            </div>

          </div>
        </>
      )}
    </div>
  );
}