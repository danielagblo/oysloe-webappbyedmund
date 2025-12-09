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

const CircularSummaries = ({ categories, total, categoriesLoading, categoriesError }: Props) => {
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
        return <p className="text-xl py-17 text-center">Ad count summaries are currently unavailiable.</p>
    }

    return (
        <div className=" text-(--dark-def) flex items-center justify-center w-full overflow-hidden my-12 lg:h-50 h-25">
            <div className="justify-center max-md:gap-2 items-center flex-nowrap grid grid-cols-5 sm:w-3/5 gap-2 max-sm:px-3">

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
                                className="relative w-auto h-17 lg:w-4/5 flex items-center justify-center"
                            >
                                <CircularProgressbar
                                    value={percentage}
                                    styles={{
                                        path: {
                                            stroke: "var(--dark-def)",
                                            strokeLinecap: "round",
                                        },
                                    }}
                                />
                                <div className="absolute flex flex-col items-center justify-center text-center">
                                    <span className="text-[2.5vw] md:text-xs lg:text-[1.2vw] min-w-[60px]">
                                        {category.name}
                                    </span>
                                    <span className="text-xs md:text-xl lg:text-2xl font-bold text-(--accent-color)">
                                        {formatCount(category.adsCount)}
                                    </span>
                                </div>
                            </div>
                        );
                    })}
            </div>
        </div>
    )
};

export default CircularSummaries;
