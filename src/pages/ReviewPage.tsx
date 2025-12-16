import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import { toast } from "sonner";
import "../App.css";
import LottieSuccess from "../components/LottieSuccess";
import MenuButton from "../components/MenuButton";
import MobileBanner from "../components/MobileBanner";
import ProfileStats from "../components/ProfileStats";
import useReviews from "../features/reviews/useReviews";
import useUserProfile from "../features/userProfile/useUserProfile";
import {
  createReview,
  likeReview,
  patchReview,
} from "../services/reviewService";
import type { Review, ReviewPayload } from "../types/Review";
import { formatReviewDate } from "../utils/formatReviewDate";

const ReviewPage = () => {
  const [sendSuccess, setSendSuccess] = useState(false);
  const [selectedStars, setSelectedStars] = useState(0);
  const [showMobileForm, setShowMobileForm] = useState(false);
  const [comment, setComment] = useState("");
  const [animatingLikes, setAnimatingLikes] = useState<Set<number>>(new Set());
  const [editingReviewId, setEditingReviewId] = useState<number | null>(null);
  const location = useLocation();

  // Try to determine a product id from either location state or query string.
  // Supports: navigate('/reviews', { state: { productId: 123 } })
  // or /reviews?product=123
  type LocationState = { productId?: number; adData?: { id?: number } };
  const stateVal = (location.state || {}) as LocationState;
  const stateProductId =
    typeof stateVal.productId === "number"
      ? stateVal.productId
      : typeof stateVal?.adData?.id === "number"
        ? stateVal.adData!.id
        : undefined;
  const queryProductRaw = new URLSearchParams(location.search).get("product");
  const queryProductId = queryProductRaw ? Number(queryProductRaw) : undefined;
  const productId =
    typeof stateProductId === "number"
      ? stateProductId
      : typeof queryProductId === "number" && !Number.isNaN(queryProductId)
        ? queryProductId
        : undefined;

  const { reviews, isLoading, refetch } = useReviews(
    productId ? { product: productId } : undefined,
  );
  const queryClient = useQueryClient();
  const { profile: currentUserProfile } = useUserProfile();

  const handleOpenEditForm = (reviewId: number) => {
    const review = reviews.find((r) => r.id === reviewId);
    if (review) {
      setEditingReviewId(reviewId);
      setSelectedStars(Math.round(review.rating));
      setComment(review.comment || "");
      setShowMobileForm(true);
    }
  };

  const handleResetForm = () => {
    setEditingReviewId(null);
    setSelectedStars(0);
    setComment("");
    setShowMobileForm(false);
  };

  const createMutation = useMutation<Review, unknown, Partial<ReviewPayload>>({
    mutationFn: async (body: Partial<ReviewPayload>) => {
      if (editingReviewId) {
        return patchReview(editingReviewId, body);
      }
      return createReview(body as ReviewPayload);
    },
    onSuccess: () => {
      setSendSuccess(true);
      handleResetForm();
      // refresh reviews list for this product (or all reviews if no product)
      const key: readonly unknown[] = productId
        ? ["reviews", { product: productId }]
        : ["reviews", {}];
      queryClient.invalidateQueries({ queryKey: key });
      refetch();
    },
    onError: (err: unknown) => {
      // apiClient throws an Error with the response body appended to the message.
      // Try to parse JSON from the error message to extract backend validation messages.
      const message = err instanceof Error ? err.message : String(err);
      const jsonStart = message.indexOf("{");
      if (jsonStart !== -1) {
        try {
          const jsonPart = message.slice(jsonStart);
          const parsed = JSON.parse(jsonPart);
          if (parsed && typeof parsed === "object") {
            const nf = parsed.non_field_errors || [];

            if (Array.isArray(nf) && nf.length > 0) {
              toast.error(nf.join(" "));
              return;
            }

            const firstKey = Object.keys(parsed)[0];
            if (firstKey && parsed[firstKey]) {
              const v = parsed[firstKey];
              if (Array.isArray(v)) toast.error(String(v[0]));
              else toast.error(String(v));
              return;
            }
          }
        } catch {
          // fall through to raw message
        }
      }
      toast.error(message);
    },
  });
  const likeMutation = useMutation({
    mutationFn: async ({
      id,
      body,
    }: {
      id: number;
      body?: Record<string, unknown>;
    }) => {
      return likeReview(id, body);
    },
    onSuccess: (data: Review) => {
      // update the single review cache and refresh list
      const key: readonly unknown[] = productId
        ? ["reviews", { product: productId }]
        : ["reviews", {}];
      queryClient.setQueryData(["review", data.id], data);
      queryClient.invalidateQueries({ queryKey: key });
      refetch();
    },
    onError: (err: unknown) => {
      const m = err instanceof Error ? err.message : String(err);
      toast.error(m);
    },
  });
  const [ratingFilter, setRatingFilter] = useState<number | null>(null);
  const displayedReviews = ratingFilter
    ? reviews.filter((r) => Math.round(r.rating) === ratingFilter)
    : reviews;

  // Auto-dismiss the success modal after a short timeout so it doesn't block the UI.
  useEffect(() => {
    if (!sendSuccess) return;
    const t = setTimeout(() => setSendSuccess(false), 3000);
    return () => clearTimeout(t);
  }, [sendSuccess]);

  return (
    <div className="flex flex-col lg:flex-row items-center justify-center w-[100vw] min-h-screen bg-(--div-active) text-(--dark-def) relative overflow-hidden">
      {/* Mobile header */}
      <div className="sm:hidden w-full fixed top-0 z-30">
        <MobileBanner page="Reviews" />
      </div>

      {/* Profile sidebar (desktop only) */}
      <div className="hidden sm:flex w-[25vw] h-[100vh] items-center justify-center pl-2">
        <ProfileStats />
      </div>

      {/* Main Review Area (desktop) */}
      <div className="hidden sm:flex w-[75vw] h-[93vh] pr-2 gap-4 mt-0">
        {/* Comments Panel */}
        <div className="relative bg-white w-[55%] rounded-2xl shadow-lg flex flex-col p-4 overflow-y-auto no-scrollbar">
          <div className="sticky -mt-4 -top-4 left-0 pt-2 bg-white">
            <h2 className="text-2xl font-semibold mb-4 text-center">
              User Reviews
            </h2>

            {/* Star Filter Bar */}
            <div className="bg-white/95 backdrop-blur-md px-2 py-3 border-b min-h-fit border-gray-100 flex flex-nowrap gap-1 justify-around overflow-x-auto no-scrollbar text-sm">
              <button
                onClick={() => setRatingFilter(null)}
                className={`flex items-center justify-center gap-1 px-3 py-2 rounded-full whitespace-nowrap ${ratingFilter === null ? "bg-(--div-active) text-(--dark-def)" : "bg-gray-100"}`}
              >
                <img src="/star.svg" alt="" className="w-4 h-4" /> All
              </button>
              {[1, 2, 3, 4, 5].map((star) => (
                <button
                  key={star}
                  onClick={() => setRatingFilter(star)}
                  className={`flex justify-center items-center gap-1 rounded-full px-3 py-2 h-auto ${ratingFilter === star ? "bg-(--div-active) text-(--dark-def)" : "bg-gray-100"}`}
                >
                  <img src="/star.svg" alt="" className="w-4 h-4" />
                  {star}
                </button>
              ))}
            </div>
          </div>

          {/* Comments */}
          <div className="space-y-4 mt-4">
            {isLoading ? (
              Array.from({ length: 3 }).map((_, i) => (
                <div
                  key={i}
                  className="pb-4 border-b border-gray-100 flex items-center gap-3 animate-pulse"
                >
                  <div className="w-10 h-10 rounded-lg bg-gray-300 shrink-0" />
                  <div className="flex flex-col w-full gap-2">
                    <div className="h-2.5 bg-gray-300 rounded w-24" />
                    <div className="h-3 bg-gray-300 rounded w-32" />
                    <div className="h-2 bg-gray-300 rounded w-full" />
                  </div>
                </div>
              ))
            ) : reviews.length === 0 ? (
              <div className="flex flex-col items-center justify-center gap-3 py-8">
                <img src="/nothing-to-show.png" alt="Nothing to show" className="w-32 h-32 object-contain" />
                <p className="text-center text-gray-500">This ad has no reviews.</p>
              </div>
            ) : displayedReviews.length === 0 ? (
              <div className="flex flex-col items-center justify-center gap-3 py-8">
                <img src="/nothing-to-show.png" alt="Nothing to show" className="w-32 h-32 object-contain" />
                <p className="text-center text-gray-500">No reviews with {ratingFilter} star rating{ratingFilter === 1 ? '' : 's'}.</p>
              </div>
            ) : (
              displayedReviews.map((rev) => (
                <div
                  key={rev.id}
                  className="pb-4 border-b border-gray-100 last:border-b-0"
                >
                  <div className="flex items-center gap-3 justify-between">
                    <div className="flex items-center gap-3">
                      <img
                        src={rev.user?.avatar || "/userPfp2.jpg"}
                        alt=""
                        className="w-10 h-10 rounded-lg"
                      />
                      <div className="flex flex-col">
                        <p className="text-[10px] text-gray-400">
                          {formatReviewDate(rev.created_at)}
                        </p>
                        <h3 className="font-semibold">
                          {currentUserProfile?.id === rev.user?.id
                            ? "You"
                            : rev.user?.account_name ||
                              rev.user?.name ||
                              "User"}
                        </h3>
                        <div className="flex">
                          {Array.from({ length: 5 }).map((_, j) => (
                            <img
                              key={j}
                              src="/star.svg"
                              alt=""
                              className={`w-3 h-3 ${j < rev.rating ? "opacity-100" : "opacity-30"}`}
                            />
                          ))}
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      {currentUserProfile?.id === rev.user?.id && (
                        <button
                          onClick={() => handleOpenEditForm(rev.id)}
                          className="text-gray-500 hover:text-gray-700 transition"
                          aria-label="Edit review"
                        >
                          <svg
                            className="w-4 h-4"
                            fill="currentColor"
                            viewBox="0 0 20 20"
                          >
                            <path d="M13.586 3.586a2 2 0 112.828 2.828l-.793.793-2.828-2.828.793-.793zM11.379 5.793L3 14.172V17h2.828l8.38-8.379-2.83-2.828z" />
                          </svg>
                        </button>
                      )}
                      <button
                        onClick={() => {
                          if (likeMutation.isPending) return;
                          setAnimatingLikes((prev) =>
                            new Set(prev).add(rev.id),
                          );
                          setTimeout(() => {
                            setAnimatingLikes((prev) => {
                              const next = new Set(prev);
                              next.delete(rev.id);
                              return next;
                            });
                          }, 300);
                          likeMutation.mutate({ id: rev.id });
                        }}
                        className="flex items-center gap-1"
                        aria-label={rev.liked ? "Unlike review" : "Like review"}
                      >
                        <img
                          src="/like.svg"
                          alt=""
                          className={`w-4 h-4 transition-opacity ${
                            animatingLikes.has(rev.id)
                              ? "animate-like-heartbeat"
                              : ""
                          } ${rev.liked ? "opacity-100" : "opacity-60"}`}
                        />
                      </button>
                      <span className="text-xs text-gray-500">
                        {rev.likes_count ?? 0}
                      </span>
                    </div>
                  </div>
                  <p className="text-gray-700 text-sm mt-1">{rev.comment}</p>
                </div>
              ))
            )}
            <div className="h-8 bg-white" />
          </div>
        </div>

        {/* Make a Review Panel (desktop) */}
        <div className="bg-white w-[45%] rounded-2xl shadow-sm flex flex-col items-center justify-start p-6 relative">
          <h2 className="text-2xl font-semibold mb-6 text-center">
            Make a Review
          </h2>

          {/* Star Selection */}
          <div className="flex justify-around mb-4 w-4/5">
            {[1, 2, 3, 4, 5].map((star) => (
              <img
                key={star}
                src="/star.svg"
                alt=""
                className={`w-10 h-10 cursor-pointer transition ${
                  star <= selectedStars ? "opacity-100" : "opacity-40"
                }`}
                onClick={() => setSelectedStars(star)}
              />
            ))}
          </div>

          <h3 className="text-center text-gray-600 mb-6">
            {selectedStars === 0
              ? "Rate your experience"
              : selectedStars === 5
                ? "Excellent"
                : selectedStars === 4
                  ? "Good"
                  : selectedStars === 3
                    ? "Average"
                    : selectedStars === 2
                      ? "Poor"
                      : "Terrible"}
          </h3>

          {/* Comment Input */}
          <textarea
            placeholder="Comment"
            value={comment}
            onChange={(e) => setComment(e.target.value)}
            className="border border-gray-300 rounded-lg p-3 w-11/12 h-28 resize-none mb-6 focus:outline-none focus:ring-2 focus:ring-[var(--dark-def)]"
          />

          {/* Send Button */}
          <button
            onClick={() => {
              if (selectedStars <= 0) return;
              if (!productId) {
                // product is required by the API for product reviews
                // guide the user to open reviews from a product page
                // (AdsDetailsPage already navigates with productId)
                alert(
                  "Product id missing. Open this page from a product to leave a review.",
                );
                return;
              }
              createMutation.mutate({
                product: productId,
                rating: selectedStars,
                comment,
              });
            }}
            className="text-lg flex items-center gap-2 p-3 px-8 bg-gray-100 rounded-lg hover:bg-gray-200 cursor-pointer transition"
          >
            {editingReviewId ? "Update Review" : "Send Review"}
          </button>

          {/* Success Modal */}
          {sendSuccess && (
            <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
              <div className="bg-white rounded-xl max-w-2/5 max-h-2/3 h-fit flex flex-col justify-center items-center p-6 text-center">
                <div className="h-auto w-100">
                  <LottieSuccess />
                </div>
                <h2 className="text-lg font-medium mb-6">Submitted!</h2>
                <button
                  className="bg-gray-200 rounded-lg px-8 py-3 cursor-pointer hover:bg-gray-300 transition"
                  onClick={() => setSendSuccess(false)}
                >
                  Close
                </button>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Mobile Layout */}
      <div className="flex flex-col sm:hidden w-full mt-16 relative">
        {/* Reviews Section */}
        <div className="p-4 bg-white h-[90vh] -mt-12">
          <h2 className="text-xl font-semibold mb-3">User Reviews</h2>
          <div className="flex gap-2 w-full items-center justify-center flex-wrap mb-4">
            <button
              onClick={() => setRatingFilter(null)}
              className={`flex items-center justify-center gap-1 p-2.5 rounded-full whitespace-nowrap ${ratingFilter === null ? "bg-(--div-active) text-(--dark-def)" : "bg-gray-100"}`}
            >
              <img src="/star.svg" alt="" className="w-4 h-4" /> All
            </button>
            {[1, 2, 3, 4, 5].map((star) => (
              <button
                key={star}
                onClick={() => setRatingFilter(star)}
                className={`flex justify-center items-center gap-1 rounded-full p-2.5 text-sm ${ratingFilter === star ? "bg-(--div-active) text-(--dark-def)" : "bg-gray-100"}`}
              >
                <img src="/star.svg" alt="" className="w-4 h-4" />
                {star}
              </button>
            ))}
          </div>

          {isLoading ? (
            Array.from({ length: 3 }).map((_, i) => (
              <div
                key={i}
                className="pb-4 border-b border-gray-100 flex items-center gap-3 animate-pulse"
              >
                <div className="w-8 h-8 rounded-lg bg-gray-300 shrink-0" />
                <div className="flex flex-col w-full gap-2">
                  <div className="h-2 bg-gray-300 rounded w-20" />
                  <div className="h-2.5 bg-gray-300 rounded w-24" />
                </div>
              </div>
            ))
          ) : reviews.length === 0 ? (
            <div className="flex flex-col items-center justify-center gap-3 py-8">
              <img src="/nothing-to-show.png" alt="Nothing to show" className="w-24 h-24 object-contain" />
              <p className="text-center text-gray-500">This ad has no reviews.</p>
            </div>
          ) : displayedReviews.length === 0 ? (
            <div className="flex flex-col items-center justify-center gap-3 py-8">
              <img src="/nothing-to-show.png" alt="Nothing to show" className="w-24 h-24 object-contain" />
              <p className="text-center text-gray-500">No reviews with {ratingFilter} star rating{ratingFilter === 1 ? '' : 's'}.</p>
            </div>
          ) : (
            <div className="overflow-y-auto no-scrollbar max-h-[calc(90vh-150px)]">
              {
                displayedReviews.map((rev) => (
                  <div key={rev.id} className="pb-4 border-b border-gray-100">
                    <div className="flex items-center gap-3 justify-between">
                      <div className="flex items-center gap-3">
                        <img
                          src={rev.user?.avatar || "/userPfp2.jpg"}
                          alt=""
                          className="w-8 h-8 rounded-lg"
                        />
                        <div className="flex flex-col">
                          <p className="text-[10px] text-gray-400">
                            {formatReviewDate(rev.created_at)}
                          </p>
                          <h3 className="font-semibold">
                            {currentUserProfile?.id === rev.user?.id
                              ? "You"
                              : rev.user?.account_name || rev.user?.name || "User"}
                          </h3>
                        </div>
                      </div>
                      {currentUserProfile?.id === rev.user?.id && (
                        <button
                          onClick={() => handleOpenEditForm(rev.id)}
                          className="text-gray-500 hover:text-gray-700 transition"
                          aria-label="Edit review"
                        >
                          <svg
                            className="w-4 h-4"
                            fill="currentColor"
                            viewBox="0 0 20 20"
                          >
                            <path d="M13.586 3.586a2 2 0 112.828 2.828l-.793.793-2.828-2.828.793-.793zM11.379 5.793L3 14.172V17h2.828l8.38-8.379-2.83-2.828z" />
                          </svg>
                        </button>
                      )}
                    </div>
                    <p className="text-gray-700 text-sm mt-1">{rev.comment}</p>
                  </div>
                ))
              }
            </div>
          )}
        </div>

        {/* Floating Add Review Button */}
        <button
          onClick={() => setShowMobileForm(true)}
          className="fixed bottom-20 right-3 bg-(--dark-def) text-white rounded-full w-14 h-14 flex items-center justify-center text-3xl shadow-lg z-30"
        >
          +
        </button>

        {/* Overlay Review Form */}
        {showMobileForm && (
          <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-40 flex justify-center items-end">
            <div className="bg-white w-full rounded-t-3xl p-6 animate-slide-up">
              <div className="flex justify-between items-center mb-3">
                <h2 className="text-xl font-semibold">
                  {editingReviewId ? "Edit Review" : "Make a Review"}
                </h2>
                <button
                  onClick={() => {
                    handleResetForm();
                  }}
                  className="text-gray-500 text-2xl"
                >
                  ×
                </button>
              </div>

              <div className="flex justify-around mb-3">
                {[1, 2, 3, 4, 5].map((star) => (
                  <img
                    key={star}
                    src="/star.svg"
                    alt=""
                    className={`w-7 h-7 cursor-pointer transition ${
                      star <= selectedStars ? "opacity-100" : "opacity-40"
                    }`}
                    onClick={() => setSelectedStars(star)}
                  />
                ))}
              </div>

              <textarea
                placeholder="Comment"
                value={comment}
                onChange={(e) => setComment(e.target.value)}
                className="border border-gray-300 rounded-lg p-3 w-full h-24 resize-none mb-4 focus:outline-none"
              />
              <button
                onClick={() => {
                  if (selectedStars <= 0) return;
                  if (!productId) {
                    alert(
                      "Product id missing. Open this page from a product to leave a review.",
                    );
                    return;
                  }
                  createMutation.mutate({
                    product: productId,
                    rating: selectedStars,
                    comment,
                  });
                }}
                className="w-full p-3 bg-gray-100 rounded-lg hover:bg-gray-200 transition"
              >
                {editingReviewId ? "Update Review" : "Send Review"}
              </button>
            </div>
          </div>
        )}
      </div>

      <MenuButton />
    </div>
  );
};

export default ReviewPage;
