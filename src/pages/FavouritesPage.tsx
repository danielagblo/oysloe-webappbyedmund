import { useState } from "react";
import { ads } from "../data/ads";
import MenuButton from "../components/MenuButton";

const FavouritesPage = () => {
  const [selectedAd, setSelectedAd] = useState<null | typeof ads[0]>(null);

  const favourites = ads.filter((ad) => ad.isFavourited);

  return (
    <div className="flex justify-between h-screen w-screen items-center bg-transparent">
      <div className="w-full flex flex-col h-full items-center gap-2 relative">
        
        <div className="sticky top-3 bg-white w-full mt-3 flex items-center px-8 py-3 rounded-2xl z-50">
          <img
            src="/favorited.svg"
            alt="Favourites"
            className="w-10 h-auto bg-[#f3f4f6] rounded-full p-2.5"
          />

          <div className="ml-8">
            <h2>{favourites.length} Ads Favourited</h2>
          </div>
        </div>

        <div className="w-full flex flex-row h-auto flex-wrap gap-2 justify-center">
          {favourites.map((ad, index) => (
            <div
              key={index}
              className="w-[32%] max-w-[300px] bg-white rounded-xl px-2 py-2 shadow-sm flex flex-col relative"
            >
              <div className="flex flex-row justify-between items-center mb-2">
                <img
                  className="bg-pink-200 h-20 w-auto rounded-lg object-cover"
                  src={ad.img}
                  alt={ad.name}
                />
                <p
                  className="inline text-lg font-bold rotate-90 select-none cursor-pointer"
                  onClick={() => setSelectedAd(ad)}
                >
                  ...
                </p>
              </div>
              <div className="mt-2">
                <p className="font-medium">{ad.name}</p>
                <p className="text-xs text-gray-600">{ad.price}</p>
              </div>
            </div>
          ))}
          <div className="h-20 w-full"/>
        </div>

        {selectedAd && (
          <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
            <div className="bg-white rounded-xl p-4 w-[90%] max-w-[400px] shadow-md relative pt-10">
              <button
                onClick={() => setSelectedAd(null)}
                className="absolute top-0 right-2 text-5xl text-gray-500 rotate-45 block py-2"
              >
                +
              </button>
              <div className="mt-6 text-center text-gray-600">
                <button className="border border-[var(--div-border)] cursor-pointer px-3.5 py-2 rounded-xl hover:bg-red-200/40">Remove From Favourites</button>
              </div>
            </div>
          </div>
        )}
      </div>
    
      <MenuButton />
    </div>
  );
};

export default FavouritesPage;
