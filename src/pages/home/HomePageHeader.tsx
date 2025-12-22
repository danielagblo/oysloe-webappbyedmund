import { useRef } from "react";

type HomePageHeaderProps = {
  searchValue: string;
  setSearchValue: (v: string) => void;
};

const HomePageHeader = ({
  searchValue,
  setSearchValue,
}: HomePageHeaderProps) => {
  const headerRef = useRef<HTMLDivElement>(null);
  // const [isSmallScreen, setIsSmallScreen] = useState(false);

  // check screen size
  // useEffect(() => {
  //   const checkScreen = () => setIsSmallScreen(window.innerWidth <= 640);
  //   checkScreen();
  //   window.addEventListener("resize", checkScreen);
  //   return () => window.removeEventListener("resize", checkScreen);
  // }, []);

  // removed condensed-on-scroll behavior — header stays static

  return (
    <div
      ref={headerRef}
      className={`w-full left-0 transition-all duration-300`}
    >
      <div className={"flex items-center max-sm:mt-7.5 transition-all duration-300 flex-col items-center justify-center gap-8 mt-30"}>
        <h2 className={"text-4xl sm:text-[4vw] font-medium text-(--dark-def) whitespace-nowrap"}>
          Oysloe
        </h2>

        <div className="flex w-full px-200">
          <div className={"relative flex items-center z-0 justify-center w-full max-w-[520px]"}>
            <div className="rotating-bg z-0" aria-hidden="true" />
            <div className="rotating-bg-inner" aria-hidden="true" />

            <div className="relative flex">
              <input
                type="search"
                value={searchValue}
                onChange={(e) => setSearchValue(e.target.value)}
                placeholder="Search anything up for good"
                className={"search-input text-2xl sm:text-2xl pl-4 pr-2 py-3 h-12 sm:h-14 sm:max-w-[70vw] max-sm:max-w-full max-sm:mx-auto rounded-full outline-0 bg-white text-center"}
              />

              <img
                src="/search.svg"
                className="absolute flex top-3.5 md:top-4.5 -left-3 max-md:left-2.5 max-sm:left-[9%] w-5 h-5 z-[1]"
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HomePageHeader;
