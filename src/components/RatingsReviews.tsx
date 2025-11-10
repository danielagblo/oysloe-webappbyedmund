import React from "react";

interface RatingReviewsProps {
  layout?: "column" | "row"; // default: column
  fullWidth?: boolean; // default: false
}

export const RatingReviews: React.FC<RatingReviewsProps> = ({
  layout = "column",
  fullWidth = false,
}) => {
  const containerClasses = `
    flex px-3 md:px-1.5 pb-2 w-full ${layout === "row" ? "-ml-4 flex-row items-center justify-between" : "flex-col items-center justify-center"}
    ${fullWidth ? "w-[95vw]" : ""}
  `;

  const ratingSection = (
    <div className={`flex flex-col items-center justify-center`}>
      <h3 className={"font-medium text-5xl mt-3 md:text-[5vw]"}> 4.5 </h3>
      <p className={` md:text-[1.5vw] ${layout === "row" ? "text-base" : "text-lg"}`}>
        ★ ★ ★ ★ <span className="text-gray-400">★</span>
      </p>
      <p
        className={`text-gray-600 md:text-[1.2vw] mb-3 ${
          layout === "row" ? "text-sm" : "text-lg"
        }`}
      >
        234 Reviews
      </p>
    </div>
  );

  const barsSection = (
    <div
      className="w-full flex flex-col justify-center items-center md:gap-2 md:px-2"
      style={{
        // fontSize: "80%",
        // width: "80%",
      }}
    >
      {[5, 4, 3, 2, 1].map((stars, index) => (
        <div
          key={index}
          className="flex items-center max-md:mb-1 max-md:-ml-5 sm:ml-0 w-full whitespace-nowrap gap-3 md:gap-0"          
        >
          <span className="text-[var(--dark-def)] w-8 text-xs md:text-[1.25vw]">★ {stars}</span>
          <div className="flex-1 h-1.25 md:h-[0.55vw] bg-gray-200 rounded mx-2">
            <div
              className="h-full bg-[var(--dark-def)] w-2/5 rounded"              
            ></div>
          </div>
          <span
            className="text-sm md:text-[1vw] text-gray-500 w-8"          
          >
            40%
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
          <div className="flex flex-row mt-2 gap-4 items-center justify-center md:justify-around md:px-[10%] md:text-[1.25vw]">
            <p className="bg-[var(--div-active)] py-1.5 px-2.5 rounded-full whitespace-nowrap">★ All</p>
            <p className="bg-[var(--div-active)] py-1.5 px-2.5 rounded-full whitespace-nowrap">★ 5</p>
            <p className="bg-[var(--div-active)] py-1.5 px-2.5 rounded-full whitespace-nowrap">★ 4</p>
            <p className="bg-[var(--div-active)] py-1.5 px-2.5 rounded-full whitespace-nowrap">★ 3</p>
            <p className="bg-[var(--div-active)] py-1.5 px-2.5 rounded-full whitespace-nowrap">★ 2</p>
            <p className="bg-[var(--div-active)] py-1.5 px-2.5 rounded-full whitespace-nowrap">★ 1</p>
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
