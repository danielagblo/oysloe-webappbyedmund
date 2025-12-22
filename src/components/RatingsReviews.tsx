import React from "react";
import useReviews, { useReviewsByOwner } from "../features/reviews/useReviews";
import type { Review } from "../types/Review";

interface RatingReviewsProps {
  layout?: "column" | "row"; // default: column
  fullWidth?: boolean; // default: false
  userId?: number; // optional filter to get reviews by a specific user
  rd?: {
    sum: number;
    count: number;
    avg: number;
    stars: { "5": number; "4": number; "3": number; "2": number; "1": number };
  }; //product rating distribution
}

export const RatingReviews: React.FC<RatingReviewsProps> = ({
  layout = "column",
  fullWidth = false,
  userId,
  rd,
}) => {
  const containerClasses = `
    flex px-3 md:px-1.5 pb-2 w-full ${layout === "row" ? "-ml-4 flex-row items-center justify-between" : "flex-col items-center justify-center"}
    ${fullWidth ? "w-[95vw]" : ""}
  `;

  let reviews: Review[] = [];
  let count = 0;
  let isLoading = false;
  // Call hooks unconditionally to preserve hook order.
  const normalHook = useReviews();
  const ownerHook = useReviewsByOwner(userId);
  const source = userId != null ? ownerHook : normalHook;
  reviews = source.reviews;
  count = source.count;
  isLoading = source.isLoading;

  // compute average rating from reviews (safe fallback to 0)
  const average =
    count > 0 ? reviews.reduce((s, r) => s + (r.rating ?? 0), 0) / count : 0;
  const avgDisplay = average ? average.toFixed(1) : "0.0";
  // number of filled stars (rounded)
  const filledStars = Math.round(average);

  const ratingSection = (
    <div className={`flex flex-col items-center justify-center`}>
      <h3 className={"font-medium text-5xl mt-3 md:text-[5vw]"}>
        {rd ? rd.avg.toFixed(1) : avgDisplay}
      </h3>
      <p
        className={` md:text-[1.5vw] whitespace-nowrap ${layout === "row" ? "text-base" : "text-lg"}`}
      >
        {Array.from({ length: 5 }).map((_, i) => (
          <span
            key={i}
            className={
              i < (rd ? Math.round(rd.sum / rd.count) : filledStars)
                ? "text-(--dark-def)"
                : "text-gray-300"
            }
          >
            ★
          </span>
        ))}
      </p>
      <p
        className={`text-gray-600 md:text-[1.2vw] mb-3 ${layout === "row" ? "text-sm" : "text-lg"}`}
      >
        {isLoading
          ? "..."
          : `${rd?.count || rd?.count === 0 ? rd?.count : count} Review${(rd?.count && rd?.count > 1) || count > 1 ? "s" : ""}`}
      </p>
    </div>
  );
  const total = reviews.length;
  const distribution = [5, 4, 3, 2, 1].map((s) => {
    const c = reviews.filter((r) => Math.round(r.rating) === s).length;
    const pct = total > 0 ? (c / total) * 100 : 0;
    return { stars: s, count: c, pct };
  });

  const barsSection = (
    <div className="w-full flex flex-col justify-center items-center gap-1 md:gap-2">
      {rd
        ? Object.entries(rd.stars)
            .sort((a, b) => Number(b[0]) - Number(a[0]))
            .map(([star, count]) => {
              const pct = rd.count > 0 ? (count / rd.count) * 100 : 0;
              return (
                <div
                  key={star}
                  className="flex items-center max-md:mb-1 max-md:-ml-5 sm:ml-0 w-full whitespace-nowrap"
                  style={{ gap: "clamp(0.5rem, 1.5vw, 1.5rem)" }}
                >
                  <span
                    className="text-(--dark-def) flex-shrink-0 text-xs md:text-[1.25vw] text-right"
                    style={{ width: "clamp(2rem, 3vw, 4rem)" }}
                  >
                    ★ {star}
                  </span>
                  <div
                    className="flex-1 h-1.25 md:h-[0.55vw] bg-gray-200 rounded"
                    style={{ minWidth: "100px", maxWidth: "600px" }}
                  >
                    <div
                      className="h-full bg-(--dark-def) rounded"
                      style={{ width: `${Math.round(pct)}%` }}
                    />
                  </div>
                  <span
                    className="text-sm md:text-[1vw] text-gray-500 flex-shrink-0 text-left"
                    style={{ width: "clamp(2.5rem, 3.5vw, 5rem)" }}
                  >
                    {Math.round(pct)}%
                  </span>
                </div>
              );
            })
        : distribution.map((item) => (
            <div
              key={item.stars}
              className="flex items-center max-md:mb-1 max-md:-ml-5 sm:ml-0 w-full whitespace-nowrap"
              style={{ gap: "clamp(0.5rem, 1.5vw, 1.5rem)" }}
            >
              <span
                className="text-(--dark-def) flex-shrink-0 text-xs md:text-[1.25vw] text-right"
                style={{ width: "clamp(2rem, 3vw, 4rem)" }}
              >
                ★ {item.stars}
              </span>
              <div
                className="flex-1 h-1.25 md:h-[0.55vw] bg-gray-200 rounded"
                style={{ minWidth: "100px", maxWidth: "600px" }}
              >
                <div
                  className="h-full bg-(--dark-def) rounded"
                  style={{ width: `${Math.round(item.pct)}%` }}
                />
              </div>
              <span
                className="text-sm md:text-[1vw] text-gray-500 flex-shrink-0 text-left"
                style={{ width: "clamp(2.5rem, 3.5vw, 5rem)" }}
              >
                {Math.round(item.pct)}%
              </span>
            </div>
          ))}
    </div>
  );

  return (
    <div className="flex flex-col">
      {layout === "row" ? (
        <>
          <div className={containerClasses}>
            <div className="flex-[0.35]">{ratingSection}</div>
            <div className="flex-[0.65] ml-4 flex items-center justify-center w-full">
              {barsSection}
            </div>
          </div>
          <div className="flex flex-row my-2 max-w-[90vw] mx-auto gap-4 max-md:gap-2 items-center justify-center md:justify-around md:px-[10%] md:text-[1.25vw]">
            <p className="bg-(--div-active) py-1.5 px-2.5 rounded-full whitespace-nowrap">
              ★ All
            </p>
            <p className="bg-(--div-active) py-1.5 px-2.5 rounded-full whitespace-nowrap">
              ★ 5
            </p>
            <p className="bg-(--div-active) py-1.5 px-2.5 rounded-full whitespace-nowrap">
              ★ 4
            </p>
            <p className="bg-(--div-active) py-1.5 px-2.5 rounded-full whitespace-nowrap">
              ★ 3
            </p>
            <p className="bg-(--div-active) py-1.5 px-2.5 rounded-full whitespace-nowrap">
              ★ 2
            </p>
            <p className="bg-(--div-active) py-1.5 px-2.5 rounded-full whitespace-nowrap">
              ★ 1
            </p>
          </div>
        </>
      ) : (
        <div className={containerClasses}>
          {ratingSection}
          {barsSection}
        </div>
      )}
    </div>
  );
};

export default RatingReviews;
