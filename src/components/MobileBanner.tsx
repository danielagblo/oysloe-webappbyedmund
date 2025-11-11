import { useNavigate } from "react-router-dom";

interface MobileBannerProps {
  backto?: string;
  page: string;
}

export const MobileBanner: React.FC<MobileBannerProps> = ({
  backto = "Back",
  page = "",
}) => {
  const navigate = useNavigate();

  return (
    <>
      <div className="fixed top-0 z-200">
        <div
          className={`relative ${page === "Alerts" ? "bg-[var(--div-active)]" : "bg-white"} w-[100vw] flex sm:hidden items-center px-2 h-12 py-3 sticky top-0 z-50`}
        >
          <button
            onClick={() => navigate(-1)}
            className="absolute left-2 flex items-center gap-1"
          >
            <img src="/arrowleft.svg" alt="Back" className="w-5 h-5" />
            <span className="text-sm">{backto}</span>
          </button>
          <h2 className="absolute w-full flex justify-center items-center text-sm font-medium rounded-2xl py-1 px-2">
            {page}
          </h2>
        </div>
      </div>
      <div className="h-10 bg-white" />
    </>
  );
};

export default MobileBanner;
