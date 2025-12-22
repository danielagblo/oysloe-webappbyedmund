import { CircularProgressbar } from "react-circular-progressbar";
import Loader from "../../components/LoadingDots";
import type { Category } from "../../types/Category";
import { formatCount } from "../../utils/formatCount";

type Props = {
  categories: (Category & { adsCount: number })[];
  total: number;
  categoriesLoading?: boolean;
  categoriesError?: any;
};

const CircularSummaries = ({
  categories,
  total,
  categoriesLoading,
  categoriesError,
}: Props) => {
  if (categoriesLoading) {
    return (
      <div className="flex flex-col items-center mt-12">
        <p className="loading-dots">Loading ad counts</p>
        <Loader className={"h-40 -mt-12"} />
      </div>
    );
  }
  if (categoriesError || !categories || categories.length === 0) {
    console.log("No categories available to be summarised.");
    return (
      <p className="text-xl py-17 text-center">
        Ad count summaries are currently unavailiable.
      </p>
    );
  }

  return (
    <div className="text-(--dark-def) w-full overflow-x-auto overflow-y-hidden my-12">
      <div className="flex justify-center items-center gap-1 sm:gap-2 w-full min-h-fit py-4 px-2 sm:px-0">
        {categories
          .sort((a, b) => b.adsCount - a.adsCount)
          .filter((cat) => cat.adsCount > 0)
          .slice(0, 5)
          .concat(categories.filter((cat) => cat.adsCount === 0))
          .slice(0, 5)
          .map((category) => {
            const percentage = ((category.adsCount || 0) / total) * 100;
            return (
              <div
                key={category.id}
                className="relative flex-shrink-0 w-16 h-16 max-sm:min-h-[18vw] max-sm:min-w-[18vw] sm:w-24 sm:h-24 lg:w-32 lg:h-32 flex items-center justify-center"
              >
                <CircularProgressbar
                  value={percentage}
                  styles={{
                    path: {
                      stroke: "var(--dark-def)",
                      strokeLinecap: "round",
                      strokeWidth: 6,
                    },
                    trail: {
                      stroke: "#e0e0e0",
                      strokeLinecap: "round",
                      strokeWidth: 6,
                    },
                  }}
                />
                <div className="absolute flex flex-col items-center justify-center text-center px-1">
                  <span className="text-[10px] sm:text-xs lg:text-sm font-medium leading-tight line-clamp-2">
                    {category.name}
                  </span>
                  <span className="text-[11px] sm:text-sm lg:text-lg font-bold text-(--accent-color) leading-tight">
                    {formatCount(category.adsCount)}
                  </span>
                </div>
              </div>
            );
          })}
      </div>
    </div>
  );
};

export default CircularSummaries;
