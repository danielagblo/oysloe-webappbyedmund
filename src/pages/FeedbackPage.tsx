import { useState, useRef, useEffect } from "react";
import useFeedbacks, {
  useCreateFeedback,
} from "../features/feedback/useFeedback";
import useIsSmallScreen from "../hooks/useIsSmallScreen";
import { toast } from "sonner";

const FeedbackPage = () => {
  const [selectedStars, setSelectedStars] = useState<number>(0);
  const [comment, setComment] = useState<string>("");
  const [sent, setSent] = useState(false);
  const [noRating, setNoRating] = useState(false);
  const [noReviewMessage, setNoReviewMessage] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [modalStartY, setModalStartY] = useState(0);
  const [modalTranslateY, setModalTranslateY] = useState(0);
  const modalRef = useRef<HTMLDivElement>(null);
  const isSmall = useIsSmallScreen();

  useFeedbacks();
  const create = useCreateFeedback();

  const handleTouchStart = (e: React.TouchEvent) => {
    if (modalRef.current?.contains(e.target as Node)) {
      setModalStartY(e.touches[0].clientY);
    }
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    if (modalStartY === 0) return;
    const currentY = e.touches[0].clientY;
    const diff = currentY - modalStartY;
    if (diff > 0) {
      setModalTranslateY(diff);
    }
  };

  const handleTouchEnd = () => {
    if (modalTranslateY > 100) {
      setShowModal(false);
      setModalTranslateY(0);
    } else {
      setModalTranslateY(0);
    }
    setModalStartY(0);
  };

  const submit = async () => {
    setNoRating(false);
    setNoReviewMessage(false);

    let hasError = false;

    if (selectedStars < 1) {
      setNoRating(true);
      toast.error("Please choose a rating.");
      hasError = true;
    }

    if (!comment.trim()) {
      setNoReviewMessage(true);
      toast.error("Please enter a review message.");
      hasError = true;
    }

    if (hasError) return;

    try {
      await create.mutateAsync({ rating: selectedStars, message: comment });
      setComment("");
      setSelectedStars(0);
      setSent(true);
      setShowModal(false);
      toast.success("Thank you. Your feedback has been sent!");
      setTimeout(() => setSent(false), 3000);
    } catch (err) {
      console.error("Failed to submit feedback", err);
      toast.error("Failed to submit feedback");
    }
  };

  if (isSmall) {
    return (
      <div className="flex justify-center items-center h-screen w-screen bg-gray-50">
        <div className="flex flex-col w-full max-w-md h-full items-center justify-center gap-4 px-4 py-8">
          <div className="flex flex-col items-center justify-center w-full gap-4 -mt-40">
            <h2 className="text-3xl font-medium text-gray-700">Feedback</h2>
            <p className="text-gray-500 text-base">Help us improve on our app</p>

            <div className="my-6 max-sm:my-2.5 text-5xl space-x-2">
              {Array.from({ length: 5 }).map((_, i) => {
                const num = i + 1;
                return (
                  <span
                    key={i}
                    className={`cursor-pointer ${num <= selectedStars ? "text-yellow-500" : "text-gray-300"}`}
                    onClick={() => setSelectedStars(num)}
                  >
                    ★
                  </span>
                );
              })}
            </div>
            <p className="text-gray-500 text-base">
              {selectedStars === 0 ? "No rating" : `${selectedStars} / 5`}
            </p>
          </div>

          <button
            onClick={() => setShowModal(true)}
            className="bg-white text-gray-700 py-4 rounded-2xl font-medium text-base cursor-pointer hover:bg-gray-100 transition fixed bottom-20 left-4 right-4"
          >
            Send Feedback
          </button>
        </div>

        {showModal && (
          <>
            <div
              className="fixed inset-0 bg-black/30 z-40"
              onClick={() => setShowModal(false)}
            />
            <div
              ref={modalRef}
              onTouchStart={handleTouchStart}
              onTouchMove={handleTouchMove}
              onTouchEnd={handleTouchEnd}
              className="fixed bottom-0 left-0 right-0 bg-white rounded-t-3xl z-50 max-w-md mx-auto w-full transition-transform"
              style={{
                transform: `translateY(${modalTranslateY}px)`,
              }}
            >
              <div className="flex justify-center pt-2 pb-4">
                <div className="w-12 h-1 bg-gray-300 rounded-full" />
              </div>
              <div className="px-4 pb-8 max-h-[80vh] overflow-y-auto">
                <h3 className="text-xl font-medium text-gray-700 mb-6">
                  Send Your Feedback
                </h3>
                <textarea
                  value={comment}
                  onChange={(e) => setComment(e.target.value)}
                  className="border-2 border-gray-300 w-full h-40 rounded-2xl text-base resize-none p-4 mb-4"
                  placeholder="Tell us what you think..."
                />

                <button
                  onClick={submit}
                  disabled={create.status === "pending"}
                  className="w-full text-base cursor-pointer bg-gray-100 py-3 rounded-2xl hover:bg-gray-200 active:scale-95 transition font-medium"
                >
                  {create.status === "pending" ? "Sending..." : "Send Review"}
                </button>
              </div>
            </div>
          </>
        )}
      </div>
    );
  }

  return (
    <div className="flex justify-between h-screen w-screen items-center gap-2 lg:overflow-hidden">
      <div className="flex flex-col lg:flex-row w-full md:py-3 h-full  justify-start gap-4 max-sm:overflow-y-hidden">
        <div className="md:bg-white w-full lg:h-[93vh] lg:w-1/2 mt-2 flex flex-col justify-start items-center gap-4 px-3 py-3 rounded-2xl text-xs lg:overflow-auto no-scrollbar">
          <div className="flex flex-col pt-5 px-5 gap-2 mb-2 w-full h-full min-h-0 justify-center items-center">
            <div className={`flex flex-col items-center justify-center w-full`}>
              <h2 className="text-2xl lg:text-[2.5vw] fontsize-20 text-gray-700 max-sm:font-medium max-sm:pt-15">
                Feedback
              </h2>
              <p className="text-gray-500 text-xl lg:text-[1.2vw]">
                Help us improve on our app
              </p>

              <div className="my-4 text-5xl lg:text-[4.5vw]">
                {Array.from({ length: 5 }).map((_, i) => {
                  const num = i + 1;
                  return (
                    <span
                      key={i}
                      className={`cursor-pointer ${num <= selectedStars ? "text-yellow-500" : "text-gray-300"}`}
                      onClick={() => setSelectedStars(num)}
                    >
                      ★
                    </span>
                  );
                })}
              </div>
              <p className="text-gray-500 text-xl lg:text-[1.2vw]">
                {selectedStars === 0 ? "No rating" : `${selectedStars} / 5`}
              </p>
            </div>
          </div>
        </div>
        <div className="bg-white w-full lg:w-1/2 lg:h-[93vh] mt-2 flex flex-col justify-start items-center gap-4 px-3 py-3 md:rounded-2xl text-xs max-lg:mb-20 max-sm:pb-200 lg:overflow-auto no-scrollbar">
          <textarea
            value={comment}
            onChange={(e) => setComment(e.target.value)}
            className="border w-full h-60 rounded-md text-lg resize-none p-2 border-gray-300 mt-[10%]"
            placeholder="Comment"
          />
          <button
            onClick={submit}
            disabled={create.status === "pending"}
            className="w-full text-lg cursor-pointer bg-gray-100 p-5 rounded-md hover:scale-95 active:scale-105 hover:bg-gray-200 transition"
          >
            {create.status === "pending" ? "Sending..." : "Send Review"}
          </button>

          {noRating && <p className="text-red-600">Please choose a rating.</p>}
          {noReviewMessage && (
            <p className="text-red-600">Please enter a review message.</p>
          )}
          {sent && (
            <p className="text-green-600">
              Thank you. Your feedback has been sent!
            </p>
          )}
        </div>
      </div>
    </div>
  );
};

export default FeedbackPage;
