import Loader from "./LoadingDots";

interface AdLoadingOverlayProps {
  isVisible: boolean;
}

const AdLoadingOverlay = ({ isVisible }: AdLoadingOverlayProps) => {
  if (!isVisible) return null;

  return (
    <div className="fixed inset-0 bg-black/40 z-998 flex flex-col items-center justify-center">
      <div className="relative flex flex-col z-999 items-center justify-center w-[90vw] h-[40vh] sm:h-1/2 rounded-2xl">
        <Loader />
      </div>
    </div>
  );
};

export default AdLoadingOverlay;
