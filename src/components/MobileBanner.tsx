import { useNavigate } from "react-router-dom";

interface MobileBannerProps {
  backto?: string,
  page: string,
}

export const MobileBanner :React.FC<MobileBannerProps> = ( { backto = "Back", page = "" } ) => {
  const navigate = useNavigate();

  return (
    <div className="sticky top-0">
      <div className={`${page === "Alerts" ? "bg-[var(--div-active)]" : "bg-white"} w-[100vw] flex sm:hidden justify-between items-center px-2 py-3 sticky top-0 z-50`}>
        <button onClick={() => navigate(-1)} className="flex items-center gap-1">
          <img src="/arrowleft.svg" alt="Back" className="w-5 h-5" />
          <span className="text-sm">{backto}</span>
        </button>
        <h2 className="text-sm font-medium rounded-2xl py-1 px-2">{page}</h2>
        <p style={{ transform: "rotate(90deg)" }}>…</p>
      </div>
    </div>
  );
};

export default MobileBanner;
