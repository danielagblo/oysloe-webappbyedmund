import RatingReviews from "./RatingsReviews";

export default function ProfileStats() {
  // mini components
  const Profile = () => (
    <div className="flex flex-col items-center pb-6 border-b border-gray-100 ">
      <img
        src="face.svg"
        alt="pfp"
        className="w-24 h-24 rounded-full object-cover mb-4 bg-pink-300"
        style={{ height: "3rem", width: "3rem" }}
      />
      <h2 className="text-xl font-medium mb-1">Alexander Kowri</h2>
      <div className="flex flex-col justify-start">
        <div>
          <svg
            width="10"
            height="11"
            viewBox="0 0 10 11"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            className="inline"
          >
            <ellipse cx="5" cy="5.24271" rx="5" ry="4.96781" fill="#74FFA7" />
            <path
              d="M2.05218 4.39318C2.37825 4.18062 2.83842 4.2557 3.08 4.56089L4.8702 6.82242L3.6894 7.59217L1.89921 5.33064C1.65763 5.02545 1.72611 4.60574 2.05218 4.39318Z"
              fill="#374957"
            />
            <rect
              width="6.34413"
              height="1.26744"
              rx="0.633722"
              transform="matrix(-0.830425 0.55713 -0.631604 -0.775291 9.14648 4.37305)"
              fill="#374957"
            />
          </svg>
          <p className="inline text-[length:10px]"> High Level</p>
        </div>
        <span className="text-xs text-green-500 font-medium bg-green-500/10 px-2 py-0.5 rounded w-[170px]" />
      </div>
    </div>
  );

  const AdStats = () => (
    <div className="flex gap-4 justify-center w-full text-sm">
      <div className="text-center bg-[var(--div-active)] p-2 rounded-lg flex-1 whitespace-nowrap">
        <p className="font-medium">900k</p>
        <p className="text-[var(--some-other-gray)] text-xs">Active Ads</p>
      </div>
      <div className="text-center bg-[var(--div-active)] p-2 rounded-lg flex-1 whitespace-nowrap">
        <p className="font-medium">900k</p>
        <p className="text-[var(--some-other-gray)] text-xs">Sold Ads</p>
      </div>
    </div>
  );

  return (
    <div className="w-[25vw] m-0 relative text-[var(--dark-def)]">
      {/* <MobileBanner /> */}
      <div className="h-[100vh] w-[23vw] hidden sm:flex flex-col gap-2 justify-center items-center">
        <div className="shadow-sm p-6 rounded-xl bg-white w-full h-[46vh]">
          <Profile />
          <AdStats />
        </div>
        <div className="shadow-sm py-2 rounded-xl bg-white w-full h-[46vh]">
          <RatingReviews />
        </div>
      </div>
    </div>
  );
}
