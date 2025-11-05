import React from "react";
import { LockClosedIcon } from "@heroicons/react/24/outline";
import MenuButton from "./MenuButton";

import gPng from "../assets/google-play-badge.png";
import iPng from "../assets/app-store-badge.png";

interface PageLockedProps {
  page: string;
}

const PageLocked: React.FC<PageLockedProps> = ({ page = "This" }) => {
  const handleAction = () => {
    if (page.toUpperCase() === "POST AD") return "post an ad";
    if (page.toUpperCase() === "PROFILE") return "edit your profile";
    if (page.toUpperCase() === "FEEDBACK") return "give us feedback";
    return "go any further";
  };

  return (
    <div className="relative flex items-center justify-center w-full h-full text-center">
      {/* Outer container changes on mobile */}
      <div
        className={`rounded-2xl bg-white px-6 py-15 sm:px-10 sm:pt-5 sm:pb-14 w-full 
          flex flex-col items-center justify-start sm:justify-center sm:rounded-2xl sm:w-auto sm:h-auto h-[100vh] shadow-lg
        `}
      >
        <p className="text-gray-700 text-lg font-medium mb-10 flex items-center justify-center gap-2">
          {page} page is locked
          <LockClosedIcon className="w-5 h-5 text-gray-700" />
        </p>

        <p className="text-[25px] sm:text-4xl lg:text-5xl font-extrabold text-gray-800 leading-tight mb-6">
          Download our mobile app to enjoy full access
        </p>

        <p className="text-gray-600 text-base sm:text-lg mb-10 max-w-md mx-auto">
          Our web version provides very limited access.
          <br />
          Download our app to {handleAction()}.
        </p>

        <div className="flex flex-col sm:flex-row justify-center items-center gap-4 sm:gap-6 mb-2">
          <a href="#" target="_blank" rel="noopener noreferrer">
            <img
              src={gPng}
              alt="Get it on Google Play"
              className="h-25 w-auto object-contain transition-transform hover:scale-105"
            />
          </a>

          <a href="#" target="_blank" rel="noopener noreferrer">
            <img
              src={iPng}
              alt="Download on the App Store"
              className="h-17 w-auto object-contain transition-transform hover:scale-105 translate-y-[2px]"
            />
          </a>
        </div>

        <MenuButton />
      </div>
    </div>
  );
};

export default PageLocked;
