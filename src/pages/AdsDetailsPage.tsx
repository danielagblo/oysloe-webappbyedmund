import { Link, useLocation, useNavigate, useParams } from "react-router-dom";
import "../App.css";
import MenuButton from "../components/MenuButton";
import RatingReviews from "../components/RatingsReviews";
import { useProduct, useProducts } from "../features/products/useProducts";
import { useMemo, useRef } from "react";
import { formatMoney } from "../utils/formatMoney";
import type { ProductFeature } from "../types/ProductFeature";
import useReviews from "../features/reviews/useReviews";
import type { Review } from "../types/Review";
import { formatReviewDate } from "../utils/formatReviewDate";

const AdsDetailsPage = () => {
  const { id } = useParams<{ id: string }>();
  const numericId = id ? +id : null;
  const navigate = useNavigate();
  const location = useLocation();
  const adDataFromState = location.state?.adData;

  const {
    data: currentAdDataFromQuery,
    isLoading: adLoading,
    error: adError,
  } = useProduct(numericId!);
  const { data: ads = [], isLoading: adsLoading } = useProducts();
  const { reviews: reviews = [] } = useReviews();

  const productReviews = useMemo(() => {
    if (!reviews || reviews.length === 0) return [];
    return reviews.filter((r: Review) => r.product?.id === numericId);
  }, [reviews, numericId]);

  const thisProductsReviews = reviews.filter(
    (review) => review?.product.id === numericId,
  );

  const reviewDeconstruction = thisProductsReviews.reduce(
    (acc, p) => {
      const star = Math.round(p.rating) as 5 | 4 | 3 | 2 | 1;
      return {
        sum: acc.sum + p.rating,
        count: acc.count + 1,
        avg: (acc.sum + p.rating) / (acc.count + 1),
        stars: {
          ...acc.stars,
          [star]: (acc.stars[star] || 0) + 1,
        },
      };
    },
    {
      sum: 0,
      count: 0,
      avg: 0,
      stars: { 5: 0, 4: 0, 3: 0, 2: 0, 1: 0 },
    },
  );

  const touchStartX = useRef<number | null>(null);

  if (!id || numericId === null)
    return (
      <p className="h-screen w-screen m-0 flex items-center justify-center">
        Invalid ad ID
      </p>
    );
  if (adLoading || adsLoading)
    return (
      <p className="h-screen w-screen m-0 flex items-center justify-center">
        Loading...
      </p>
    );
  if (adError)
    return (
      <p className="h-screen w-screen m-0 flex items-center justify-center">
        Error loading ad: {String(adError)}
      </p>
    );

  const currentIndex = ads.findIndex((a) => a.id === numericId) ?? 0;
  const totalAds = ads.length;
  const currentAdData =
    adDataFromState || currentAdDataFromQuery || ads[currentIndex];

  const handlePrevious = () => {
    if (currentIndex > 0) {
      const prevAd = ads[currentIndex - 1];
      navigate(`/ads/${prevAd.id}`, { state: { adData: prevAd } });
    }
  };

  const handleNext = () => {
    if (currentIndex < totalAds - 1) {
      const nextAd = ads[currentIndex + 1];
      navigate(`/ads/${nextAd.id}`, { state: { adData: nextAd } });
    }
  };

  const handleTouchStart = (e: React.TouchEvent) => {
    touchStartX.current = e.touches[0].clientX;
  };

  const handleTouchEnd = (e: React.TouchEvent) => {
    if (touchStartX.current === null) return;
    const diff = touchStartX.current - e.changedTouches[0].clientX;
    if (Math.abs(diff) > 50) {
      if (diff > 0) handleNext();
      else handlePrevious();
      touchStartX.current = null;
    }
  };


  // navigation
  const currentId = parseInt(id || "1");

  // mini components
  const MobileHeader = () => (
    <div className="w-screen flex sm:hidden justify-between items-center px-2 py-3 bg-(--div-active) sticky top-0 z-50">
      <button onClick={() => navigate(-1)} className="flex items-center gap-1">
        <img src="/arrowleft.svg" alt="Back" className="w-5 h-5" />
        <span className="text-sm">Back</span>
      </button>
      <h2 className="text-sm font-medium some-gray] rounded-2xl py-1 px-2">
        {currentId}/{totalAds}
      </h2>
      <div className="flex items-center gap-3">
        <div className="flex items-center gap-1">
          <img src="/flag.svg" alt="" className="w-4 h-4" />
          <span className="text-xs">24</span>
        </div>
        <div className="flex items-center gap-1">
          <img src="/favorited.svg" alt="" className="w-4 h-4" />
          <span className="text-xs">10</span>
        </div>
      </div>
    </div>
  );
  const DesktopHeader = () => (
    <div className="hidden sm:flex bg-white p-2 lg:py-2 items-center justify-evenly gap-4 w-full font-light text-xs">
      <div className="flex items-center gap-2">
        <img
          src="/location.svg"
          alt=""
          className="w-3 h-3 md:w-[1.2vw] md:h-[1.2vw]"
        />
        <h2 className="text-base md:text-[1.125vw]">
          {currentAdData?.location?.name || "Lashibi, Accra"}
        </h2>
      </div>
      <div className="flex items-center gap-2">
        <img
          src="/star.svg"
          alt=""
          className="w-3 h-3 md:w-[1.2vw] md:h-[1.2vw]"
        />
        <h2 className="text-base  md:text-[1.125vw]">
          {reviewDeconstruction.count
            ? (reviewDeconstruction.sum / reviewDeconstruction.count).toFixed(1)
            : "0.0"}{" "}
          &nbsp;&nbsp;&nbsp;{reviewDeconstruction.count || "No"} Review
          {(reviewDeconstruction.count > 1 ||
            reviewDeconstruction.count === 0) &&
            "s"}
        </h2>
      </div>
      <div className="flex items-center gap-2">
        <img
          src="/flag.svg"
          alt=""
          className="w-3 h-3 md:w-[1.2vw] md:h-[1.2vw]"
        />
        <h2 className="text-base md:text-[1.125vw]">30</h2>
      </div>
      <div className="flex items-center gap-2">
        <img
          src="/favorited.svg"
          alt=""
          className="w-5 h-5 md:w-[1.2vw] md:h-[1.2vw]"
        />
        <h2 className="text-base md:text-[1.125vw]">34</h2>
      </div>
      <div className="flex gap-2 ml-auto">
        <button
          onClick={handlePrevious}
          className="bg-gray-200 p-2 rounded-full hover:bg-gray-300"
        >
          <img
            src="/arrowleft.svg"
            alt=""
            className="w-5 h-5 md:w-[1.2vw] md:h-[1.2vw]"
          />
        </button>
        <button
          onClick={handleNext}
          className="bg-gray-200 p-2 rounded-full hover:bg-gray-300"
        >
          <img
            src="/arrowright.svg"
            alt=""
            className="w-5 h-5 md:w-[1.2vw] md:h-[1.2vw]"
          />
        </button>
      </div>
    </div>
  );
  const ImageGallery = () => {
    let imageID = 0;
    const max = currentAdDataFromQuery?.images.length || 0;

    const getImageSrc = () => {
      if (
        currentAdDataFromQuery?.images.length === 0 &&
        currentAdDataFromQuery?.image
      )
        return currentAdDataFromQuery?.image; //if there are no images, but there is an image (the cover), use the cover
      if (
        currentAdDataFromQuery?.images.length === 0 &&
        !currentAdDataFromQuery?.image
      )
        return "/public/no-image.jpeg"; //if there are no images, and there is no image (cover), use this placeholder

      const id = imageID;
      imageID = (imageID + 1) % max;
      return currentAdDataFromQuery?.images[id].image;
    };

    return (
      <div className="w-full flex justify-center my-4 sm:mb-8">
        {/* Desktop */}
        <div className="hidden sm:flex flex-row w-9/10 lg:w-full h-64 lg:h-80 gap-1">
          <div className="flex w-full">
            <img
              src={getImageSrc()}
              alt=""
              className="object-cover h-auto w-full sm:h-full sm:w-full rounded-lg"
            />
          </div>
          <div className="flex flex-row flex-wrap gap-1 sm:h-[49.3%] w-0 h-0 sm:w-8/10">
            <img
              src={getImageSrc()}
              alt=""
              className="object-cover sm:h-full sm:w-full sm:block hidden rounded-lg"
            />
            <img
              src={getImageSrc()}
              alt=""
              className="object-cover sm:h-full sm:w-full sm:block hidden rounded-lg"
            />
          </div>
          <div className="flex flex-row flex-wrap gap-1 sm:h-[49.3%] sm:w-8/10">
            <img
              src={getImageSrc()}
              alt=""
              className="object-cover sm:h-full sm:w-full sm:block hidden rounded-lg"
            />
            <img
              src={getImageSrc()}
              alt=""
              className="object-cover sm:h-full sm:w-full sm:block hidden rounded-lg"
            />
          </div>
        </div>

        {/* Mobile */}
        <div
          className="relative w-full max-w-3xl h-64 sm:h-96 overflow-hidden rounded-lg sm:hidden"
          onTouchStart={handleTouchStart}
          onTouchEnd={handleTouchEnd}
        >
          <img
            src={getImageSrc()}
            alt="Ad main"
            className="object-cover w-full h-full"
          />
          <div
            onClick={handlePrevious}
            className="absolute top-0 left-0 w-[30%] h-full z-20"
          />
          <div
            onClick={handleNext}
            className="absolute top-0 right-0 w-[30%] h-full z-20"
          />
        </div>
      </div>
    );
  };
  const TitleAndPrice = () => (
    <div className="bg-white px-4 sm:px-0 py-2 w-full text-left rounded-lg">
      <div className="flex items-center gap-2">
        <img src="/location.svg" alt="" className="w-3 h-3" />
        <h2 className="text-sm md:text-[1.1vw]">
          {currentAdData?.location?.name && currentAdData?.location?.region
            ? `${currentAdData?.location?.name}, ${currentAdData?.location?.region} Region`
            : "No location has been set for this user"}
        </h2>
      </div>
      <h2 className="text-2xl md:text-[2vw] font-medium">
        {currentAdData?.name || "Untitled Product"}
      </h2>
      <h2 className="text-xl font-medium md:text-[1.5vw]">
        {currentAdData?.price
          ? formatMoney(currentAdData?.price)
          : "Please Contact the Seller for the Price of this Product"}
      </h2>
    </div>
  );
  const AdDetails = () => (
    <div className=" sm:p-6 md:pl-0">
      <h2 className="text-xl md:text-[1.75vw] font-bold mb-2">Ad Details</h2>
      <ul className="list-disc ml-5 md:ml-10 marker:text-black marker:font-extrabold space-y-2 text-sm md:text-[1.125vw]">
        <li>
          <span className="font-bold">Ad ID&nbsp;</span> {id}
        </li>
        {currentAdDataFromQuery?.product_features.map(
          (feat: ProductFeature) => (
            <li key={feat.id}>
              <span className="font-bold">{feat.feature.name}&nbsp;</span>
              <span>{feat.value}</span>
            </li>
          ),
        )}
        {currentAdData?.location?.name && (
          <li>
            <span className="font-bold">Location&nbsp;</span>{" "}
            {currentAdData?.location?.name}
          </li>
        )}
      </ul>
    </div>
  );
  const SafetyTips = () => (
    <div className="bg-white sm:bg-(--div-active) sm:p-6 rounded-lg py-1 px-2 pb-5">
      <h2 className="text-xl font-bold mb-2 md:text-[1.75vw]">Safety tips</h2>
      <p className="text-gray-500 mb-3 py-1 px-2 rounded-2xl text-xs bg-(--div-active) sm:bg-white md:text-[0.9vw]">
        Follow this tips and report any suspicious activity.
      </p>
      <ul className="list-disc ml-5 marker:text-black space-y-2 font-bold text-sm md:text-[1.125vw]">
        <li>Meet in a public place</li>
        <li>Check the vehicle history</li>
        <li>Inspect the vehicle thoroughly</li>
        <li>Don't share personal information</li>
        <li>Trust your instincts</li>
      </ul>
    </div>
  );

  const ActionButtons = ({
    onMarkTaken = () => {},
    onReportAd = () => {},
    onCaller1 = () => {},
    onCaller2 = () => {},
    onMakeOffer = () => {},
    onFavorite = () => {},
  }: {
    onMarkTaken?: () => void;
    onReportAd?: () => void;
    onCaller1?: () => void;
    onCaller2?: () => void;
    onMakeOffer?: () => void;
    onFavorite?: () => void;
  }) => {
    const actions: Record<string, () => void> = {
      "Mark as taken": onMarkTaken,
      "Report Ad": onReportAd,
      "Caller 1": onCaller1,
      "Caller 2": onCaller2,
      "Make Offer": onMakeOffer,
      Favorites: onFavorite,
    };

    return (
      <div>
        <div className="flex flex-wrap gap-2 mb-1">
          {[
            ["mark as taken.svg", "Mark as taken"],
            ["flag.svg", "Report Ad"],
            ["outgoing call.svg", "Caller 1"],
            ["outgoing call.svg", "Caller 2"],
            ["Make an offer.svg", "Make Offer"],
            ["favorited.svg", "Favorites"],
          ].map(([icon, label]) => (
            <button
              key={label}
              className={`flex items-center gap-2 p-4 h-5 rounded-lg text-sm md:text-[1.125vw] bg-(--div-active) transition sm:bg-white hover:bg-gray-50
                ${
                  actions[label]
                    ? "cursor-pointer hover:scale-95 active:scale-105"
                    : "cursor-not-allowed"
                }
              `}
              onClick={actions[label]}
            >
              <img
                src={`/${icon}`}
                alt=""
                className="w-4 h-4 md:h-[1.125vw] md:w-[1.125vw]"
              />
              <p className="whitespace-nowrap">{label}</p>
            </button>
          ))}
        </div>
      </div>
    );
  };

  const CommentsSection = () => {
    return (
      <div className="p-6 w-full rounded-lg -ml-4 sm:ml-0 lg:p-0">
        <h2 className="text-2xl font-medium sm:hidden inline">
          Seller Reviews
        </h2>
        <h2 className="text-2xl font-medium hidden sm:inline md:text-[1.7vw]">
          Comments
        </h2>
        <div className="mt-5 -ml-4 w-[120%] sm:w-full flex flex-col gap-3">
          {productReviews.length === 0 && (
            <p>
              No <span className="max-sm:hidden">comments</span>
              <span className="sm:hidden">reviews</span> to show. Leave one?
            </p>
          )}
          {productReviews.map((review: Review) => (
            <div
              key={review.id}
              className="p-4 last:border-b-0 bg-(--div-active) rounded-lg w-full"
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <img
                    src={review.user.avatar || "/public/userPfp2.jpg"}
                    alt=""
                    className="w-10 h-10 rounded-lg"
                  />
                  <div className="flex flex-col">
                    <p className="text-[10px] text-gray-500 md:text-[0.9vw]">
                      {formatReviewDate(review.created_at)}
                    </p>
                    <h3 className="font-semibold md:text-[1.2vw]">
                      {review.user.account_name || "User"}
                    </h3>
                    <div className="flex mb-2">
                      {Array.from({ length: 5 }).map((_, i) => (
                        <p
                          key={i}
                          className={`inline-flex justify-center items-center w-3 h-3 md:w-[1.2vw] md:h-[1.2vw]  
                          ${i < review.rating ? "text-gray-700" : "text-gray-300"}`}
                        >
                          ★
                        </p>
                      ))}
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-1">
                  <button className="flex items-center gap-1 m-2 md:text-[1vw]">
                    <img
                      src="/like.svg"
                      alt=""
                      className="w-5 h-5 md:h-[1.2vw] md:w-[1.2vw]"
                    />
                    <h3>Like</h3>
                  </button>
                  <span className="text-sm md:text-[1vw]">20</span>
                </div>
              </div>
              <p className="text-gray-700 text-sm md:text-[1.123vw] md:mt-3">
                {review.comment}
              </p>
            </div>
          ))}
        </div>
        <div className="flex gap-3 mt-6 items-center justify-center md:text-[1.2vw]">
          <button
            onClick={() => navigate("/reviews")}
            className="bg-(--div-active) text-(--dark-def) px-6 py-3 rounded-full whitespace-nowrap hover:scale-95 active:105 cursor-pointer hover:bg-gray-100 transition"
          >
            Make Review
          </button>
          <button
            onClick={() => navigate("/reviews")}
            className="text-(--dark-def) px-6 py-3 rounded-full bg-(--div-active) whitespace-nowrap hover:scale-95 active:105 cursor-pointer hover:bg-gray-100 transition"
          >
            Show reviews
          </button>
        </div>
      </div>
    );
  };
  const QuickChat = () => (
    <div className="w-full">
      <div className="pt-4 w-full">
        <div className="flex items-center gap-2 mb-3">
          <img src="/quick chat.svg" alt="" className="w-5 h-5" />
          <h6 className="font-semibold text-xs md:text-[1vw]">Quick Chat</h6>
        </div>
        <div className="flex flex-wrap flex-row gap-2 mb-4 w-full text-gray-400 sm:text-(--dark-def) font-extralight justify-start">
          {[
            "Is this Original?",
            "Do you have delivery options?",
            "What is the warranty period?",
            "Can I see the service history?",
          ].map((text, i) => (
            <button
              key={i}
              className="px-3 py-2 bg-(--div-active) sm:bg-white rounded text-xs md:text-[0.9vw] hover:bg-gray-100 whitespace-nowrap w-fit"
            >
              {text}
            </button>
          ))}
        </div>

        <div className="flex gap-2 w-full">
          <input
            type="text"
            placeholder="Start a chat"
            style={{ border: "1px solid var(--div-border)" }}
            className="rounded-2xl px-3 py-3 bg-[url('/send.svg')] bg-size-[20px_20px] bg-position-[center_right_12px] bg-no-repeat sm:bg-white text-sm md:text-[1.125vw] w-full sm:border-(--dark-def)"
          />
          <button
            style={{ border: "1px solid var(--div-border)" }}
            className="p-2 rounded-2xl hover:bg-gray-300 sm:bg-white"
          >
            <img
              src="/audio.svg"
              alt=""
              className="w-7 h-5 md:h-[1.5vw] md:w-[1.5vw]"
            />
          </button>
        </div>
        <div className="mt-4 space-y-2 text-[10px] inline-flex flex-wrap gap-2 text-gray-600">
          <div className="flex items-center justify-end relative">
            <h4 className="bg-(--green) h-fit p-0 pl-1 pr-8 rounded-2xl md:text-[0.8vw]">
              Chat is secured
            </h4>
            <img
              src="/lock-on-svgrepo-com.svg"
              alt=""
              className="bg-(--green) z-10 rounded-full w-6 h-6 p-1 absolute"
            />
          </div>
          <div className="flex -mt-2 items-center gap-1 md:text-[0.8vw]">
            <img
              src="/shield.svg"
              alt=""
              className="w-3 h-3 md:w-[0.9vw] md:h-[0.9vw]"
            />
            <h4>Always chat here for Safety reasons!</h4>
          </div>
        </div>
      </div>
    </div>
  );
  const SellerInfo = () => (
    <div className="sm:mt-4">
      {/* profile bit pc */}
      <div className="hidden sm:flex flex-row gap-4 bg-(--div-active) px-4 py-7 rounded-2xl mb-5">
        <div className="relative">
          <img
            src="/face.svg"
            alt=""
            className="w-15 h-15 md:w-[5vw] md:h-[5vw] rounded-full"
          />
          <img
            src="/verified.svg"
            alt=""
            className="absolute -bottom-1 -right-2 w-8 h-8 md:w-[3vw] md:h-[3vw]"
          />
        </div>
        <div>
          <h2 className="text-sm text-gray-500 md:text-[1vw]">Jan,2024</h2>
          <h3 className="font-semibold md:text-[1.2vw]">Alexander Kowri</h3>
          <h3 className="text-sm text-gray-600 md:text-[1vw]">Total Ads: 2k</h3>
        </div>
      </div>
      {/* store name */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-start gap-2 flex-col">
          <h4 className="text-xl md:text-[1.5vw]">ElectroMart Gh Ltd</h4>
          <div className="flex bg-green-300 px-1 p-0.5 rounded items-center gap-1">
            <img src="/tick.svg" alt="" className="w-3 h-3" />
            <span className="text-[10px] md:text-[0.9vw] text-green-800">
              High level
            </span>
          </div>
        </div>
        <button className="px-2 py-1 rounded text-sm md:text-[1vw] bg-(--div-active)">
          Seller Ads
        </button>
      </div>

      {/* product slideshow */}
      <div className="flex items-center justify-center mb-4 w-full">
        <div className="pt-4 overflow-x-hidden w-full">
          <div className="relative flex items-center justify-center gap-2 w-full">
            <button className="absolute left-1 bg-gray-100 p-1 rounded-full hover:bg-gray-300">
              <img src="/arrowleft.svg" alt="" className="w-4 h-4" />
            </button>
            <div className="flex gap-2 overflow-x-auto flex-1 no-scrollbar">
              <img
                src="/fashion.png"
                alt=""
                className="bg-(--div-active) w-23 h-23 object-cover rounded shrink-0"
              />
              <img
                src="/games.png"
                alt=""
                className="bg-(--div-active) w-23 h-23 object-cover rounded shrink-0"
              />
              <img
                src="/grocery.png"
                alt=""
                className="bg-(--div-active) w-23 h-23 object-cover rounded shrink-0"
              />
              <img
                src="/grocery.png"
                alt=""
                className="bg-(--div-active) w-23 h-23 object-cover rounded shrink-0"
              />
              <img
                src="/grocery.png"
                alt=""
                className="bg-(--div-active) w-23 h-23 object-cover rounded shrink-0"
              />
            </div>
            <button className="absolute right-1 bg-gray-100 p-1 rounded-full hover:bg-gray-300">
              <img src="/arrowright.svg" alt="" className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      {/* profile bit mobile*/}
      <div className="sm:hidden flex flex-row gap-4 bg-(--div-active) p-4 rounded-2xl mb-5">
        <div className="relative">
          <img src="/face.svg" alt="" className="w-15 h-15 rounded-full" />
          <img
            src="/verified.svg"
            alt=""
            className="absolute -bottom-1 -right-2 w-8 h-8"
          />
        </div>
        <div>
          <h2 className="text-sm text-gray-500">Jan,2024</h2>
          <h3 className="font-semibold">Alexander Kowri</h3>
          <h3 className="text-sm text-gray-600">Total Ads: 2k</h3>
        </div>
      </div>
    </div>
  );
  const SimilarAds = () => (
    <div className="bg-white sm:bg-(--div-active) max-sm:p-4 sm:py-6 w-screen md:px-12">
      <h2 className="text-xl font-bold mb-6 px-2 md:px-20 lg:text-2xl">
        Similar Ads
      </h2>

      <div className="flex flex-wrap gap-2 sm:gap-3 w-full justify-center ">
        {ads.map((ad) => (
          <Link
            key={ad.id}
            to={`/ads/${ad.id}`}
            state={{ adData: ad }}
            className="inline-block rounded-2xl overflow-hidden shrink-0 w-[38vw] sm:w-48 md:w-52"
          >
            <img
              src={ad.image || "/public/no-image.jpeg"}
              alt={ad.name.slice(0, 10)}
              className="w-full h-[120px] sm:h-48 object-cover rounded-2xl"
            />
            <div className="flex items-center gap-1 px-2 py-1">
              <img
                src="/location.svg"
                alt=""
                className="w-3 sm:w-4 h-3 sm:h-4 md:h-[1.2vw] md:w-[1.2vw]"
              />
              <p className="text-[10px] sm:text-xs md:text-[0.9vw] text-gray-500 truncate">
                {ad.location?.name}
              </p>
            </div>
            <p className="px-2 text-[11px] sm:text-sm md:text-[1.2vw] line-clamp-1 text-gray-600">
              {ad.name}
            </p>
            <p className="px-2 text-[11px] sm:text-sm md:text-[1.125vw] font-medium text-gray-800">
              {formatMoney(ad.price, "GHS")}
            </p>
          </Link>
        ))}
      </div>
    </div>
  );

  return (
    <div className="lg:pt-5">
      <div
        style={{ color: "var(--dark-def)" }}
        className="flex flex-col items-center w-[calc(100%-0.2rem)] sm:w-full min-h-screen px-4 sm:px-12 gap-6 overflow-x-hidden bg-(--div-active) sm:bg-white"
      >
        <MobileHeader />

        <div className="w-full md:p-6">
          <DesktopHeader />
          <ImageGallery />
          <TitleAndPrice />

          {/* MAIN CONTENT */}
          <div className="flex flex-col gap-4 w-full">
            <div className="flex justify-evenly gap-4 flex-col md:px-4 lg:px-0 ad-details-page">
              <div className="flex w-full justify-between ad-details-page">
                <div className="flex flex-col space-y-6 w-fit md:w-1/2 mb-6 md:min-h-[250px]">
                  <AdDetails />
                </div>
                <div className="flex flex-col space-y-6 w-full md:w-1/2">
                  <SafetyTips />
                </div>
              </div>

              {/* mobile layout */}
              <div className="sm:hidden flex w-full ad-details-page">
                <div className="flex flex-col w-fit space-y-6 md:w-1/2  bg-white p-6 rounded-lg mb-5">
                  <ActionButtons />
                  <QuickChat />
                </div>
                <div className="bg-white p-6 rounded-lg w-full">
                  <SellerInfo />
                  <div className="hidden md:block">
                    <RatingReviews layout="row" />
                  </div>
                  <div className="md:hidden">
                    <RatingReviews fullWidth rd={reviewDeconstruction} />
                  </div>
                </div>

                <div className="bg-white mt-6 p-6 rounded-lg w-full">
                  <CommentsSection />
                </div>
              </div>

              {/* desktop layout */}
              <div className=" hidden sm:grid sm:grid-cols-2 gap-1.5 w-full ad-details-page">
                <div className="flex flex-col w-full space-y-6 p-6 lg:p-0 mb-5">
                  <RatingReviews layout="row" rd={reviewDeconstruction} />
                  <CommentsSection />
                </div>
                <div className="p-6 rounded-lg w-full -mt-17">
                  <div className="sm:bg-(--div-active) w-full p-3 rounded-2xl">
                    <ActionButtons />
                    <QuickChat />
                  </div>
                  <SellerInfo />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className="w-screen p-0 lg:mt-15">
        <SimilarAds />
        <div className="p-8 sm:p-10 bg-(--div-active)" />
      </div>
      <MenuButton />
    </div>
  );
};

export default AdsDetailsPage;
