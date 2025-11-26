import { useState } from "react";
import useFeedbacks, { useCreateFeedback } from "../features/feedback/useFeedback";

const FeedbackPage = () => {
  const [selectedStars, setSelectedStars] = useState<number>(0);
  const [comment, setComment] = useState<string>("");
  const [sent, setSent] = useState(false);

  useFeedbacks();
  const create = useCreateFeedback();

  const submit = async () => {
    if (selectedStars < 1 || selectedStars > 5) return;
    try {
      await create.mutateAsync({ rating: selectedStars, message: comment });
      setComment("");
      setSelectedStars(0);
      setSent(true);
      setTimeout(() => setSent(false), 3000);
    } catch (err) {
      console.error("Failed to submit feedback", err);
    }
  };

  return (
    <div className="flex justify-between h-screen w-screen items-center gap-2">
      <div className="flex flex-col lg:flex-row w-full md:py-3 h-full  justify-start gap-4 max-sm:overflow-y-hidden">
        <div className="md:bg-white w-full lg:w-1/2 mt-2 flex flex-col justify-start items-center gap-4 px-3 py-3 rounded-2xl text-xs">
          <div className="flex flex-col pt-5 px-5 gap-2 mb-2 w-full h-full min-h-0 justify-center items-center">
            <div className={`flex flex-col items-center justify-center w-full`}>
              <h2 className="text-2xl fontsize-20 text-gray-700 max-sm:font-medium max-sm:pt-15">
                Feedback
              </h2>
              <p className="text-gray-500">Help us improve on our app</p>

              <div className="my-4 text-5xl">
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
              <p className="text-gray-500">{selectedStars === 0 ? "No rating" : `${selectedStars} / 5`}</p>
            </div>
          </div>
        </div>
        <div className="bg-white w-full lg:w-1/2 mt-2 flex flex-col justify-start items-center gap-4 px-3 py-3 md:rounded-2xl text-xs max-lg:mb-20 max-sm:pb-200">
          <textarea
            value={comment}
            onChange={(e) => setComment(e.target.value)}
            className="border w-full h-60 rounded-md resize-none p-2 border-gray-300 mt-[10%]"
            placeholder="Comment"
          />
          <button
            onClick={submit}
            disabled={create.status === "pending"}
            className="w-full cursor-pointer bg-gray-100 p-5 rounded-md"
          >
            {create.status === "pending" ? "Sending..." : "Send Review"}
          </button>
          {sent && <p className="text-green-600">Thanks — feedback sent.</p>}
        </div>
      </div>
    </div>
  );
};

export default FeedbackPage;
