import useUserProfile from "../features/userProfile/useUserProfile";
import { buildMediaUrl } from "../services/media";
import type { UserProfile } from "../types/UserProfile";
import ProgressBar from "./ProgressBar";
import RatingReviews from "./RatingsReviews";

export default function ProfileStats() {
  const { profile: user, loading } = useUserProfile();
  let name = (user as UserProfile)?.name
  // break names into single entities by the space ok
  const nameParts = name?.split(" ") || [];
  const names = []
  names.push(nameParts[0] || "")
  names.push(nameParts[nameParts.length - 1] || "")
  name = names.join(" ");

  // mini components
  const Profile = () => (
    <div className="flex flex-col items-center pb-6 md:pb-4 border-b border-gray-100 ">
      <img
        src={
          buildMediaUrl((user as UserProfile)?.avatar) || "/userPfp2.jpg"
        }
        alt="pfp"
        className="rounded-full object-cover mb-3 bg-green-100 h-[4rem] w-[4rem] md:h-[7vw] md:w-[7vw]"
      />
      <h2 className="text-xl font-medium mb-1 md:text-[2vw]">
        {loading ? "" : name || " "}
      </h2>
      <div className="flex flex-col justify-start w-full">
        <div>
          <svg
            width="1.2vw"
            height="1.2vw"
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
          <p className="inline text-[length:10px] md:text-[0.9vw]">
            {" "}
            {loading ? "" : (user as UserProfile)?.level || "High Level"}
          </p>
        </div>
        {/* Referral progress: use reusable ProgressBar */}
        {(() => {
          const points = Number((user as UserProfile)?.referral_points ?? 0) || 0;
          let percent = Math.round(points * 100);
          if (!isFinite(percent) || percent < 0) percent = 0;
          if (percent > 100) percent = 100;
          return <ProgressBar percent={percent} />;
        })()}
      </div>
    </div>
  );

  const AdStats = () => (
    <div className="flex gap-4 justify-center w-full text-sm">
      <div className="text-center bg-[var(--div-active)] p-2 rounded-lg flex-1 whitespace-nowrap">
        <p className="font-medium md:text-[1.5vw]">{(user?.active_ads ?? 0).toLocaleString()}</p>
        <p className="text-[var(--some-other-gray)] text-xs md:text-[1.125vw]">
          Active Ads
        </p>
      </div>
      <div className="text-center bg-[var(--div-active)] p-2 rounded-lg flex-1 whitespace-nowrap">
        <p className="font-medium md:text-[1.5vw]">{(user?.taken_ads ?? 0).toLocaleString()}</p>
        <p className="text-[var(--some-other-gray)] text-xs md:text-[1.125vw]">
          Sold Ads
        </p>
      </div>
    </div>
  );

  return (
    <div className="w-[25vw] m-0 relative text-[var(--dark-def)] flex">
      {/* <MobileBanner /> */}
      <div className="h-[100vh] w-[23vw] hidden sm:flex flex-col gap-2 justify-center items-center">
        <div className="shadow-sm p-6 rounded-xl bg-white w-full h-[46vh] flex flex-col justify-around">
          <Profile />
          <AdStats />
        </div>
        <div className="shadow-sm py-2 rounded-xl bg-white w-full h-[46vh]">
          <RatingReviews userId={user ? (user as UserProfile).id : undefined} />
        </div>
      </div>
    </div>
  );
}
