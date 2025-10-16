import React from 'react';
import { LockClosedIcon } from '@heroicons/react/24/outline';
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
    return "go any further";
  };

  return (
    <div className="relative flex items-center justify-center w-full h-full text-center">
      <div className="shadow-lg rounded-2xl bg-white px-6 py-10 sm:px-10 sm:py-14 max-w-2xl w-full flex flex-col items-center justify-center">
 
        <p className="text-gray-700 text-lg font-medium mb-10 flex items-center justify-center gap-2">
          {page} page is locked
          <LockClosedIcon className="w-5 h-5 text-gray-700" />
        </p>

        <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-gray-800 leading-tight mb-6">
          Download our mobile app to enjoy full access
        </h1>

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
              className="h-25 sm:h-25 lg:h-25 w-auto object-contain transition-transform hover:scale-105"
            />
          </a>

          <a href="#" target="_blank" rel="noopener noreferrer">
            <img
              src={iPng}
              alt="Download on the App Store"
              className="h-12 sm:h-[3.8rem] lg:h-[4.2rem] w-auto object-contain transition-transform hover:scale-105 translate-y-[2px]"
            />
          </a>
        </div>

        <MenuButton />
      </div>
    </div>
  );
};

export default PageLocked;
