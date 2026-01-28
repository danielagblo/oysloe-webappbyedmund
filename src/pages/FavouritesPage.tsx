import { useState } from "react";
import MenuButton from "../components/MenuButton";
import useIsSmallScreen from "../hooks/useIsSmallScreen";
import useFavourites from "../features/products/useFavourites";
import SkeletonLoader from "../components/SkeletonLoader";
import type { Product } from "../types/Product";
import { formatMoney } from "../utils/formatMoney";
import { useNavigate } from "react-router-dom";

const FavouritesPage = () => {
  const isSmall = useIsSmallScreen(1023);
  const [selectedAd, setSelectedAd] = useState<null | Product>(null);

  const {
    data: favourites = [],
    isLoading,
    isError,
    toggleFavourite,
  } = useFavourites();
  const navigate = useNavigate();

  return (
    <>
      {/* Mobile, ipad Layout */}
      {isSmall && (
        <div className="flex flex-col w-screen h-screen bg-gray-50 max-lg:pt-17.5">
          {/* Header */}
          {/* <div className="px-4 py-4">
            <div className="flex items-center gap-3">
              <img
                src="/favorited.svg"
                alt="Favourites"
                className="w-10 h-10 bg-[#f3f4f6] rounded-full p-2"
              />
              <div>
                <h2 className="font-bold text-lg">{favourites.length}</h2>
                <p className="text-sm text-gray-600">Ads Favourited</p>
              </div>
            </div>
          </div> */}

          {/* Favourites List */}
          <div className="flex-1 overflow-y-auto px-4 pb-20">
            {isLoading ? (
              <SkeletonLoader isSmall={isSmall} />
            ) : isError ? (
              <div className="flex justify-center items-center h-full">
                <p className="text-gray-600">Failed to load favourites.</p>
              </div>
            ) : favourites.length === 0 ? (
              <div className="flex flex-col gap-4 justify-center items-center h-full">
                <img
                  src="/nothing-to-show.png"
                  alt="Nothing to show here"
                  className="h-40 w-auto"
                />
                <p className="text-lg text-gray-600">
                  You have no favourited ads.
                </p>
              </div>
            ) : (
              <div className="flex flex-col gap-3">
                {favourites.map((ad, index) => (
                  <div
                    key={ad.id ?? index}
                    className="bg-white rounded-xl p-3 flex items-center gap-3 shadow-sm relative"
                    onClick={() => navigate(`/ads/${ad.id}`) }
                  >
                    {/* Image on left */}
                    <img
                      className="h-20 w-24 sm:h-24 sm:w-32 rounded-lg object-cover flex-shrink-0"
                      src={ad.image ?? "/no-image.jpeg"}
                      alt={ad.name ?? "Favourite"}
                    />

                    {/* Name and Price */}
                    <div className="flex-1 min-w-0">
                      <p className="font-medium text-sm sm:text-base truncate">{ad.name}</p>
                      <p className="text-xs sm:text-lg text-gray-600">
                        {formatMoney(ad.price)}
                      </p>
                    </div>

                    {/* Heart button */}
                    <button
                      onClick={() => setSelectedAd(selectedAd?.id === ad.id ? null : ad)}
                      className="flex-shrink-0 p-2"
                    >
                      <img
                        src="/favorited.svg"
                        alt="favourite"
                        className="w-6 h-6"
                      />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}

      {/* Desktop Layout */}
      {!isSmall && (
        <div className="text-[var(--dark-def)] flex justify-between h-screen w-screen items-center bg-transparent lg:overflow-hidden">
        <div className="w-full flex flex-col h-full lg:max-h-[97vh] items-center gap-2 relative lg:overflow-auto no-scrollbar max-sm:pt-14">
          <div className="hidden sticky top-3 bg-white w-full mt-3 sm:flex items-center px-8 py-3 md:py-5 rounded-2xl z-50">
            <img
              src="/favorited.svg"
              alt="Favourites"
              className="w-10 md:w-[3vw] h-auto bg-[#f3f4f6] rounded-full p-2.5"
            />

            <div className="ml-8 md:ml-3 md:text-[1.5vw]">
              <h2>{favourites.length} Ads Favourited</h2>
            </div>
          </div>

          <div className="sm:hidden fixed top-14 left-0 py-4 w-full flex justify-center items-center bg-[#ededed] z-20">
            <img
              src="/favorited.svg"
              alt="Favourites"
              className="w-10 max-lg:w-20 h-auto bg-[#f3f4f6] rounded-full p-2.5"
            />

            <div className="ml-8">
              <h2>
                <span className="font-bold text-xl">{favourites.length}</span> Ad{favourites.length !== 1 ? "s" : ""}
                Favourited
              </h2>
            </div>
          </div>

            <div className="w-full grid grid-cols-2 pt-20 md:pt-0 px-2 lg:px-0 lg:flex lg:flex-row max-lg:overflow-auto no-scrollbar max-lg:pb-20 h-auto lg:flex-wrap gap-2">
            {isLoading ? (
              <SkeletonLoader isSmall={isSmall} />
            ) : isError ? (
              <p className="text-center col-span-full h-full w-full flex justify-center items-center text-xl text-(--dark-def)">
                Failed to load favourites.
              </p>
            ) : favourites.length === 0 ? (
              <div className="text-center col-span-full h-full min-h-[55vh] w-full flex flex-col gap-4 justify-center items-center overflow-hidden">
                <img
                  src="/nothing-to-show.png"
                  alt="Nothing to show here"
                  className="h-40 lg:h-50 w-auto"
                />
                <p className="text-xl text-(--dark-def)">
                  You have no favourited ads.
                </p>
              </div>
            ) : (
              <>
                {favourites.map((ad, index) => (
                  <div
                    key={ad.id ?? index}
                    className="lg:w-[32%] lg:max-w-[325px] lg:min-w-[185px] bg-white rounded-xl px-2 py-2 shadow-sm flex flex-col relative"
                  >
                    <div className="flex flex-row justify-between items-center mb-2">
                      <img
                        className="bg-gray-200 h-20 w-auto rounded-lg object-cover max-w-40 min-w-20"
                        src={ad.image ?? "/no-image.jpeg"}
                        alt={ad.name ?? "Favourite"}
                      />
                      <p
                        className="inline text-lg font-bold rotate-90 select-none cursor-pointer bg-[var(--div-active)] px-4 rounded-full pb-2"
                        onClick={() => setSelectedAd(ad)}
                      >
                        ...
                      </p>
                    </div>
                    <div className="mt-2">
                      <div className="w-4/5">
                        <p className="font-medium truncate">{ad.name}</p>
                      </div>
                      <p className="text-xs text-gray-600">
                        {formatMoney(ad.price)}
                      </p>
                    </div>
                  </div>
                ))}
              </>
            )}
            {!isLoading && <div className="h-20 w-full" />}
          </div>
        </div>
        </div>
      )}

      {selectedAd && (
        <div 
          className="fixed inset-0 bg-black/40 flex items-center justify-center z-50"
          onClick={() => setSelectedAd(null)}
        >
          <div 
            className="bg-white rounded-xl p-4 w-[90%] max-w-[400px] shadow-md relative pt-10"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              onClick={() => setSelectedAd(null)}
              className="absolute top-0 right-2 text-5xl text-gray-500 rotate-45 block py-2"
            >
              +
            </button>
            <div className="mt-6 text-center text-gray-600 flex flex-col gap-1.5 sm:grid sm:grid-cols-2 sm:justify-center items-center">
              <button
                className="border border-[var(--div-border)] sm:w-full sm:h-full cursor-pointer px-3.5 py-4 sm:py-2 rounded-xl hover:bg-green-200/40 max-sm:w-4/5"
                onClick={() => navigate("/ads/" + (selectedAd as any).id)}
              >
                Open
              </button>
              <button
                className="border border-[var(--div-border)] sm:w-full sm:h-full cursor-pointer px-3.5 py-4 sm:py-2 rounded-xl hover:bg-red-200/40   max-sm:w-4/5"
                onClick={() => {
                  toggleFavourite.mutate((selectedAd as any).id);
                  setSelectedAd(null);
                }}
              >
                Remove From Favourites
              </button>
            </div>
          </div>
        </div>
      )}

      <MenuButton />
    </>
  );
};

export default FavouritesPage;
