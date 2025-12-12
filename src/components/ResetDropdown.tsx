import { useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { Link, useNavigate } from "react-router-dom";

export const ResetDropdown = ({ page = "default" }: { page?: string }) => {
  // const navigate = useNavigate();
  const [showResetDropdown, setShowResetDropdown] = useState(false);
  const dropdownRef = useRef<HTMLDivElement | null>(null);
  const navigate = useNavigate();

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
      {page === "email-reset" ? (
        <button
          type="button"
          onClick={(e) => {
            e.stopPropagation();
            navigate("/login");
          }}
          className="px-5 py-3 w-full bg-[#F9F9F9] text-(--dark-def) max-sm:bg-white max-sm:h-[50px] max-sm:w-[152px] rounded-full text-[12px] sm:text-xs hover:bg-gray-100 transition cursor-pointer"
        >
          Login
        </button>
      ) : page === "phone-reset" ?
        (
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              navigate("/reset-password/email");
            }}
            className="px-5 py-3 w-full bg-[#F9F9F9] text-(--dark-def) max-sm:bg-white max-sm:h-[50px] max-sm:w-[152px] rounded-full text-[12px] sm:text-xs hover:bg-gray-100 transition cursor-pointer"
          >
            Reset with Email
          </button>
        ) : (
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              setShowResetDropdown((p) => !p);
            }}
            className="px-5 py-3 w-full bg-[#F9F9F9] text-(--dark-def) max-sm:bg-white max-sm:h-[50px] max-sm:w-[152px] rounded-full text-[12px] sm:text-xs hover:bg-gray-100 transition cursor-pointer"
          >
            Password Reset
          </button>
        )}

      {showResetDropdown && (
        <div className="absolute left-0 w-full mt-1 bg-white border border-gray-200 rounded-lg shadow-lg z-50 pointer-events-auto">
          <Link to="/reset-password/email">
            <button className="w-full max-sm:text-gray-600 cursor-pointer text-left px-4 py-2 max-sm:py-4 text-[12px] sm:text-xs hover:bg-gray-100 rounded-t-lg whitespace-nowrap">
              Reset with Email
            </button>
          </Link>

          <Link to="/reset-password/phone" state={{ mode: "reset-password" }}>
            <button className="w-full  max-sm:text-gray-600  cursor-pointer text-left px-4 py-2 max-sm:py-4 border-t text-[12px] sm:text-xs hover:bg-gray-100 rounded-b-lg whitespace-nowrap">
              Reset with Phone
            </button>
          </Link>
        </div>
      )}

      {showResetDropdown &&
        createPortal(
          <div
            className="fixed top-0 left-0 h-screen w-screen z-40 bg-transparent"
            onClick={() => setShowResetDropdown(false)}
          />,
          document.body
        )}
    </div>
  );
};
