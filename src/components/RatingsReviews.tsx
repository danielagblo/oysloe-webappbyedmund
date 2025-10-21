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
    flex px-3 -ml-4 ${layout === "row" ? "flex-row items-center justify-between" : "flex-col items-center justify-center"}
    ${fullWidth ? "w-[100vw]" : ""}
  `;

  const ratingSection = (
    <div
      className={`flex flex-col  ${
        layout === "row" ? "items-center" : "items-center"
      } justify-center`}
    >
      <h3
        className={`font-extrabold mb-1 ${
          layout === "row" ? "text-3xl" : "text-5xl"
        }`}
      >
        4.5
      </h3>
      <p className={`${layout === "row" ? "text-base" : "text-lg"}`}>
        ★ ★ ★ ★ <span className="text-gray-400">★</span>
      </p>
      <p
        className={`text-gray-600 mb-6 ${
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
        width: "100%",
      }}
    >
      {[5, 5, 5, 5, 1].map((stars, index) => (
        <div
          key={index}
          className="flex items-center mb-1 -ml-5"
          style={{ width: "100%" }}
        >
          <span className="text-black w-8 text-sm">★ {stars}</span>
          <div className="flex-1 h-1.25 bg-gray-200 rounded mx-2">
            <div
              className="h-full bg-black rounded"
              style={{ width: "40%" }}
            ></div>
          </div>
          <span
            className="text-sm text-gray-500 w-8"
            style={{ fontSize: "80%" }}
          >
            50%
          </span>
        </div>
      ))}
    </div>
  );

  return (
    <div className={containerClasses}>
      {layout === "row" ? (
        <>
          <div className="flex-[0.35]">{ratingSection}</div>
          <div className="flex-[0.65] ml-4">{barsSection}</div>
        </>
      ) : (
        <>
          {ratingSection}
          {barsSection}
        </>
      )}
    </div>
  );
};

export default RatingReviews;
