import { useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";

export const ResetDropdown = () => {
  // const navigate = useNavigate();
  const [showResetDropdown, setShowResetDropdown] = useState(false);
  const dropdownRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setShowResetDropdown(false);
      }
    }

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        type="button"
        onClick={(e) => {
          e.stopPropagation();
          setShowResetDropdown((p) => !p);
        }}
        className="px-5 py-3 w-full bg-[#F9F9F9] text-black rounded-full text-[9px] sm:text-xs hover:bg-gray-100 transition cursor-pointer"
      >
        Password Reset
      </button>

      {showResetDropdown && (
        <div className="absolute left-0 w-full mt-1 bg-white border border-gray-200 rounded-lg shadow-lg z-20">
          <Link to="/reset-password/email">
            <button className="w-full text-left px-4 py-2 text-[10px] sm:text-xs hover:bg-gray-100 rounded-t-lg whitespace-nowrap">
              Reset with Email
            </button>
          </Link>

          <Link to="/reset-password/phone" state={{ mode: "reset-password" }}>
            <button className="w-full text-left px-4 py-2 text-[10px] sm:text-xs hover:bg-gray-100 rounded-b-lg whitespace-nowrap">
              Reset with Phone
            </button>
          </Link>
        </div>
      )}
    </div>
  );
};
