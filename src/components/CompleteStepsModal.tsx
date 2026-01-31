import { useNavigate } from "react-router-dom";
import useIsSmallScreen from "../hooks/useIsSmallScreen";

interface CompleteStepsModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const CompleteStepsModal = ({ isOpen, onClose }: CompleteStepsModalProps) => {
  const navigate = useNavigate();
  const isSmall = useIsSmallScreen();

  if (!isOpen) return null;

  const handleCompleteSteps = () => {
    onClose();
    try {
      localStorage.setItem("profile_active_tab", "profile");
    } catch {
      // ignore storage errors
    }
    navigate("/profile");
  };

  const handleSkip = () => {
    onClose();
    // Clear the login timestamp so we don't show it again
    try {
      localStorage.removeItem("oysloe_just_logged_in");
    } catch {
      // ignore storage errors
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-black/40 backdrop-blur-sm">
      <div
        className={`bg-white w-full max-sm:h-full max-sm:py-20 overflow-y-auto no-scrollbar sm:max-w-md sm:max-h-[85vh] sm:rounded-3xl shadow-2xl p-6 sm:p-7 ${
          isSmall ? "max-sm:pb-8" : ""
        }`}
      >
        <div className="flex items-start justify-between">
          <p className="text-lg sm:text-[2vw] text-gray-700 font-medium leading-snug pr-6">
            Showcase your brand to credible buyers across the internet
            (Tiktok, Google, Facebook) on Oysloe.
          </p>
          <button
            type="button"
            onClick={handleSkip}
            className="text-gray-500 hover:text-gray-700"
            aria-label="Close"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="currentColor"
              className="w-6 h-6"
            >
              <path d="M6.225 4.811a1 1 0 011.414 0L12 9.172l4.361-4.36a1 1 0 111.414 1.414L13.414 10.586l4.36 4.361a1 1 0 01-1.414 1.414L12 12l-4.361 4.361a1 1 0 01-1.414-1.414l4.36-4.361-4.36-4.36a1 1 0 010-1.415z" />
            </svg>
          </button>
        </div>

        <p className="text-sm sm:text-[1.1vw] text-gray-500 mt-2">
          Complete this 3 simple steps to start earning-10x
        </p>

        <div className="mt-5 rounded-3xl bg-gray-50 p-4">
          <div className="flex items-start gap-4">
            <div className="flex flex-col items-center">
              <div className="h-12 w-12 rounded-full bg-[#A6F4B8] flex items-center justify-center">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="#0F5132"
                  strokeWidth="1.5"
                  className="w-6 h-6"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M12 12a4 4 0 100-8 4 4 0 000 8zm0 2c-4.418 0-8 2.239-8 5v1h16v-1c0-2.761-3.582-5-8-5z"
                  />
                </svg>
              </div>
              <div className="w-px flex-1 bg-gray-300 my-2" />
            </div>
            <div className="flex-1">
              <p className="font-semibold lg:text-[1.25vw] text-gray-800">Finalize Account Setup</p>
              <p className="text-sm lg:text-[1.1vw] text-gray-500">
                Upload the required remaining details, of the business at{" "}
                <span 
                  className="bg-transparent px-1 cursor-pointer rounded-sm font-semibold text-gray-900"
                  onClick={(e) => {
                    e.preventDefault();
                    handleCompleteSteps();
                  }}
                >
                  Edit Profile
                </span>
              </p>
            </div>
          </div>

          <div className="flex items-start gap-4 mt-4">
            <div className="flex flex-col items-center">
              <div className="h-12 w-12 rounded-full bg-[#DDF59B] flex items-center justify-center">
                <img className="p-2" src="/subecribe.svg" alt="subscribe" />
              </div>
              <div className="w-px flex-1 bg-gray-300 my-2" />
            </div>
            <div className="flex-1">
              <p className="font-semibold sm:text-[1.25vw] text-gray-800">Subscribe To Boost 10x</p>
              <p className="text-sm lg:text-[1.1vw] text-gray-500">
                Activate a subscription to unlock full access, promote your
                listings
              </p>
            </div>
          </div>

          <div className="flex items-start gap-4 mt-4">
            <div className="flex flex-col items-center">
              <div className="h-12 w-12 rounded-full bg-[#F2D19B] flex items-center justify-center">
                <img className="p-2.5" src="/Post.svg" alt="post" />
              </div>
            </div>
            <div className="flex-1">
              <p className="font-semibold lg:text-[1.25vw] text-gray-800">Post Ads Now</p>
              <div className="mt-1 text-sm lg:text-[1.1vw] text-gray-500">
                You're set 100% to upload unlimited ads to real buyers
              </div>
            </div>
          </div>
        </div>

        <button
          type="button"
          onClick={handleCompleteSteps}
          className="mt-5 w-full rounded-2xl bg-[#9AF4A5] py-4 text-base lg:text-[1.25vw] font-semibold text-gray-800 hover:bg-[#86ee95] transition"
        >
          Complete steps
        </button>

        <p className="text-xs text-gray-400 text-center mt-3">
          Skip if you're not a business owner
        </p>
        <button
          type="button"
          onClick={handleSkip}
          className="mt-2 w-full rounded-2xl border border-transparent hover:bg-transparent cursort-pointer hover:border-gray-200 py-3 text-sm hover:text-gray-600 bg-gray-100 transition"
        >
          Skip
        </button>
      </div>
    </div>
  );
};

export default CompleteStepsModal;
