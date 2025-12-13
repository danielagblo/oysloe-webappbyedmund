import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import type { Category } from "../../types/Category";

type Props = {
  categories: Category[];
  onCategoryClick: (name: string) => void;
  categoriesLoading?: boolean;
  categoriesError?: any;
};

const SelectACategory = ({
  categories,
  onCategoryClick,
  categoriesLoading,
  categoriesError,
}: Props) => {
  const navigate = useNavigate();

  if (categoriesLoading) {
    return (
      <div className="w-[94vw] sm:max-w-[98vw] mt-3 mx-auto sm:flex sm:justify-center">
        <div
          className="grid grid-cols-5 gap-2 sm:gap-4 place-items-center justify-items-center max-w-full w-full sm:max-w-4/5 max-sm:flex max-sm:flex-wrap max-sm:w-screen max-sm:items-center max-sm:justify-center"
          style={{ gridAutoRows: "1fr" }}
        >
          {Array.from({ length: 10 }).map((_, i) => (
            <div
              key={i}
              className="
                                flex flex-col items-center justify-center
                                w-[12vw] h-[12vw] min-h-[75px] min-w-[75px]
                                bg-(--div-active) rounded-lg 
                                p-0 sm:p-3 cursor-progress animate-pulse
                                max-sm:w-[20vw] max-sm:h-[20vw]
                                max-sm:min-w-[75px] max-sm:min-h-[75px]
                                "
            >
              <div className="w-[8vw] h-[8vw] max-sm:w-[12vw] max-sm:h-[12vw] min-h-[45px] min-w-[45px] relative rounded-full bg-gray-200" />
              <div className="mt-2 h-3 w-3/5 bg-gray-300 rounded-full" />
            </div>
          ))}
        </div>
      </div>
    );
  }
  if (categoriesError || !categories || categories.length === 0) {
    if (categoriesError)
      console.log("Failed to load categories.", categoriesError);
    if (!categories || categories.length === 0)
      console.log("No categories were found.");

    return (
      <div className="w-[94vw] sm:max-w-[80vw] mt-3 mx-auto">
        <div
          className="
                        grid 
                        grid-cols-5 
                        gap-2 sm:gap-4 
                        place-items-center
                        justify-items-center
                        max-w-full
                    "
          style={{
            gridAutoRows: "1fr",
          }}
        >
          {[
            "Cosmetics",
            "Electronics",
            "Fashion",
            "Furniture",
            "Games",
            "Grocery",
            "Industry",
            "Property",
            "Services",
            "Vehicle",
          ]
            .slice(0, 10)
            .map((category, ix) => (
              <div
                key={ix}
                onClick={() =>
                  toast("Data is currently unavailable for " + category)
                }
                className="
                                flex flex-col items-center justify-center
                                w-[12vw] h-[12vw] min-h-[75px] min-w-[75px] 
                                bg-(--div-active) rounded-lg 
                                p-2 sm:p-3 cursor-pointer 
                                hover:bg-gray-300
                            "
              >
                <div className="w-[8vw] h-[8vw] min-h-[45px] min-w-[45px] sm:h-20 sm:w-20 relative rounded-full bg-white">
                  <img
                    src={`/${category.toLowerCase()}.png`}
                    alt={category}
                    className="absolute bottom-1 sm:bottom-3 w-[7vw] h-[7vw] min-w-[85%] min-h-[85%] object-contain left-1/2 -translate-x-1/2"
                  />
                </div>
                <h3 className="text-center  text-xs sm:text-[1.25vw] mt-1 truncate">
                  {category}
                </h3>
              </div>
            ))}
        </div>
      </div>
    );
  }
  return (
    <div className="w-[94vw] sm:max-w-[98vw] mt-3 mx-auto sm:flex sm:justify-center">
      <div
        className="
                    grid 
                    grid-cols-5 
                    gap-2 sm:gap-4 
                    place-items-center
                    justify-items-center
                    max-w-full w-full sm:max-w-4/5

                    max-sm:flex max-sm:flex-wrap max-sm:w-screen
                    max-sm:items-center max-sm:justify-center
                "
        style={{
          gridAutoRows: "1fr",
        }}
      >
        {categories.slice(0, 10).map((category) => (
          <div
            key={category.id}
            onClick={() => {
              if (category.name.toUpperCase() === "SERVICES") {
                navigate("/apply");
                return;
              }
              onCategoryClick(category.name);
            }}
            className="
                            flex flex-col items-center justify-center
                            w-[12vw] h-[12vw] min-h-[75px] min-w-[75px]
                            bg-(--div-active) rounded-lg 
                            p-0 sm:p-3 cursor-pointer 
                            hover:bg-gray-300

                            max-sm:w-[20vw] max-sm:h-[20vw]
                            max-sm:min-w-[75px] max-sm:min-h-[75px]
                        "
          >
            <div className="w-[8vw] h-[8vw] max-sm:w-[12vw] max-sm:h-[12vw] min-h-[45px] min-w-[45px] relative rounded-full bg-white">
              <img
                src={`/${category.name.toLowerCase()}.png`}
                alt={category.name}
                className="absolute bottom-1 sm:bottom-3 w-[7vw] h-[7vw] max-sm:w-[8vw] max-sm:h-[8vw] min-w-[85%] min-h-[85%] object-contain left-1/2 -translate-x-1/2"
              />
            </div>
            <h3 className="text-center flex items-center justify-center text-xs sm:text-[1.25vw] mt-1 truncate">
              {category.name}
            </h3>
          </div>
        ))}
      </div>
    </div>
  );
};

export default SelectACategory;
