import { useNavigate } from "react-router-dom";

interface MobileBannerProps {
  backto?: string;
  page: string;
  onMenuClick?: () => void;
  showMenuButton?: boolean;
  onBackClick?: () => void;
}

export const MobileBanner: React.FC<MobileBannerProps> = ({
  backto = "Back",
  page = "",
  onMenuClick,
  showMenuButton = false,
  onBackClick,
}) => {
  const navigate = useNavigate();

  const handleBack = () => {
    if (onBackClick) {
      onBackClick();
    } else {
      navigate(-1);
    }
  };

  return (
    <>
      <div className="fixed top-0 z-50">
        <div
          className={`relative ${page === "Alerts" ? "bg-[var(--div-active)]" : "bg-white"} w-[100vw] flex lg:hidden items-center px-2 h-12 py-3 sticky top-0 z-50`}
        >
          <button
            onClick={handleBack}
            className="absolute left-2 top-1/2 -translate-y-1/2 flex items-center gap-1 z-50 py-2 px-1"
          >
            <img src="/arrowleft.svg" alt="Back" className="w-5 h-5" />
            <span className="text-sm">{backto}</span>
          </button>
          <h2 className="absolute w-full flex justify-center items-center text-sm font-medium rounded-2xl py-1 px-2">
            {page}
          </h2>
          {showMenuButton && onMenuClick && (
            <button
              onClick={onMenuClick}
              className="absolute right-2 p-2 hover:bg-gray-100 rounded-full transition"
            >
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                <path d="M10 6a2 2 0 110-4 2 2 0 010 4zM10 12a2 2 0 110-4 2 2 0 010 4zM10 18a2 2 0 110-4 2 2 0 010 4z" />
              </svg>
            </button>
          )}
        </div>
      </div>
      <div className="h-10 bg-white" />
    </>
  );
};

export default MobileBanner;
