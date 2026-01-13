import React from "react";
import { formatReviewDate } from "../../../utils/formatReviewDate";
import { formatReviewerName } from "../../../utils/formatReviewerName";
import type { Review } from "../../../types/Review";

interface CommentsSectionProps {
  thisProductsReviews: Review[];
  navigate: (path: string, options?: any) => void;
  currentAdData: any;
  numericId: number | null;
  likeMutation: any;
}

const CommentsSection: React.FC<CommentsSectionProps> = ({
  thisProductsReviews,
  navigate,
  currentAdData,
  numericId,
  likeMutation,
}) => {
  return (
    <div className="lg:p-2 w-full rounded-lg lg:p-0">
      <h2 className="text-2xl font-medium sm:hidden inline">Seller Reviews</h2>
      <h2 className="text-2xl font-medium hidden sm:inline sm:text-5 lg:text-[1.7vw]">
        Comments
      </h2>
      <div className="mt-5 lg:-ml-4 w-full flex-col gap-3">
        {thisProductsReviews.length === 0 && (
          <p className="sm:text-5 lg:text-[1.2vw]">
            No <span className="max-sm:hidden">comments</span>
            <span className="sm:hidden">reviews</span> to show. Leave one?
          </p>
        )}
        {thisProductsReviews.slice(0, 3).map((review: Review) => (
          <div
            key={review.id}
            className="p-4 mb-2 last:border-b-0 bg-(--div-active) rounded-lg w-full"
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <img
                  src={review.user.avatar || "/userPfp2.jpg"}
                  alt=""
                  className="w-10 h-10 rounded-lg"
                />
                <div className="flex flex-col">
                  <p className="text-[10px] text-gray-500 md:text-[0.9vw]">
                    {formatReviewDate(review.created_at)}
                  </p>
                  <h3 className="font-semibold text-[15px] md:text-[1.2vw] truncate">
                    <span className="md:hidden">
                      {formatReviewerName(review.user.name)}
                    </span>
                    <span className="hidden md:inline">
                      {review.user.name || "User"}
                    </span>
                  </h3>
                  <div className="flex mb-2 mt-1">
                    {Array.from({ length: 5 }).map((_, i) => (
                      <p
                        key={i}
                        className={`inline-flex justify-center items-center w-3 h-3 md:w-[1.2vw] md:h-[1.2vw]  
                          ${i < review.rating ? "text-gray-700" : "text-gray-300"}`}
                      >
                        ★
                      </p>
                    ))}
                  </div>
                </div>
              </div>
              <div className="flex items-center gap-1">
                <button
                  onClick={() => {
                    if (likeMutation.isPending) return;
                    likeMutation.mutate({ id: review.id });
                  }}
                  className="flex items-center gap-1 m-2 md:text-[1vw]"
                  aria-label={review?.liked ? "Unlike review" : "Like review"}
                >
                  <div className="flex items-center gap-2 justify-center px-2 py-1 bg-white rounded-xl hover:bg-gray-100 transition cursor-pointer">
                    <img
                      src="/like.svg"
                      alt=""
                      className={`w-5 h-5 md:h-[1.2vw] md:w-[1.2vw] transition-opacity ${review?.liked ? "opacity-100" : "opacity-60"}`}
                    />
                    <h3>{review?.liked ? "Unlike" : "Like"}</h3>
                  </div>
                </button>
                <span className="text-sm md:text-[1vw]">
                  {review.likes_count ?? 0}
                </span>
              </div>
            </div>
            <p className="text-gray-700 text-sm md:text-[1.123vw] md:mt-3">
              {review.comment}
            </p>
          </div>
        ))}
      </div>
      <div className="flex gap-3 mt-6 items-center justify-center sm:text-5 lg:text-[1.2vw]">
        <button
          onClick={() => {
            const id = currentAdData?.id ?? numericId;
            if (typeof id === "number") {
              navigate(`/reviews?product=${id}`, { state: { productId: id } });
            } else {
              navigate("/reviews");
            }
          }}
          className="bg-(--div-active) text-(--dark-def) px-6 py-3 rounded-full whitespace-nowrap hover:scale-95 active:105 cursor-pointer hover:bg-gray-100 transition"
        >
          Make Review
        </button>
        <button
          onClick={() => {
            const id = currentAdData?.id ?? numericId;
            if (typeof id === "number") {
              navigate(`/reviews?product=${id}`, { state: { productId: id } });
            } else {
              navigate("/reviews");
            }
          }}
          className="text-(--dark-def) px-6 py-3 rounded-full bg-(--div-active) whitespace-nowrap hover:scale-95 active:105 cursor-pointer hover:bg-gray-100 transition"
        >
          Show reviews
        </button>
      </div>
    </div>
  );
};

export default React.memo(CommentsSection);
