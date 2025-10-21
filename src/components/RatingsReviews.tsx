import React from "react";

interface RatingReviewsProps {
  layout?: "column" | "row"; // default: column
  fullWidth?: boolean;       // default: false
}

export const RatingReviews: React.FC<RatingReviewsProps> = ({
  layout = "column",
  fullWidth = false,
}) => {
  const containerClasses = `
    flex px-3 pb-2 w-full ${layout === "row" ? "-ml-4 flex-row items-center justify-between" : "flex-col items-center justify-center"}
    ${fullWidth ? "w-[95vw]" : ""}
  `;

  const ratingSection = (
    <div className={`flex flex-col items-center justify-center`} >
      <h3 className={"font-medium text-5xl mt-3"}> 4.5 </h3>
      <p className={`${layout === "row" ? "text-base" : "text-lg"}`}>
        ★ ★ ★ ★ <span className="text-gray-400">★</span>
      </p>
      <p
        className={`text-gray-600 mb-3 ${
          layout === "row" ? "text-sm" : "text-lg"
        }`}
      >
        234 Reviews
      </p>
    </div>
  );

  const barsSection = (
    <div
      style={{
        fontSize: "80%",
        width: "80%",
      }}
    >
      {[5, 4, 3, 2, 1].map((stars, index) => (
        <div
          key={index}
          className="flex items-center mb-1 -ml-5 sm:ml-0"
          style={{ width: "100%" }}
        >
          <span className="text-[var(--dark-def)] w-8 text-xs">★ {stars}</span>
          <div className="flex-1 h-1.25 bg-gray-200 rounded mx-2">
            <div
              className="h-full bg-[var(--dark-def)] rounded"
              style={{ width: "40%" }}
            ></div>
          </div>
          <span
            className="text-sm text-gray-500 w-8"
            style={{ fontSize: "65%" }}
          >
            50%
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
            <div className="flex-[0.65] ml-4">{barsSection}</div>
          </div>
          <div className="flex flex-row mt-2 gap-4 items-center justify-center">
            <p className="bg-[var(--div-active)] p-1.5 rounded-2xl">★ All</p>
            <p className="bg-[var(--div-active)] p-1.5 rounded-2xl">★ 5</p>
            <p className="bg-[var(--div-active)] p-1.5 rounded-2xl">★ 4</p>
            <p className="bg-[var(--div-active)] p-1.5 rounded-2xl">★ 3</p>
            <p className="bg-[var(--div-active)] p-1.5 rounded-2xl">★ 2</p>
            <p className="bg-[var(--div-active)] p-1.5 rounded-2xl">★ 1</p>
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
