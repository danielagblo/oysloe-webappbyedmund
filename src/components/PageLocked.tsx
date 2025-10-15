import React from 'react';
import { LockClosedIcon } from '@heroicons/react/24/outline';
import MenuButton from "./MenuButton"

interface PageLockedProps {
  page: string
}

const PageLocked: React.FC<PageLockedProps> = ({ page = "This" }) => {

  const handleAction = () => {
    if (page.toUpperCase() === "POST AD") {
      return "post an ad";
    } else if (page.toUpperCase() === "PROFILE") {
      return "edit your profile";
    } else {
      return "go any further";
    }
  }

  return (

    <div className="p-2 flex h-full items-center justify-center text-center">  
      <div className='shadow-lg' style={{ padding: "3rem", borderRadius:"12px", backgroundColor:"white" }}>
          <p className="text-gray-700 text-lg font-medium mb-12">
            {page} page is locked 
            <LockClosedIcon className="w-5 h-5 ml-2 inline translate-y-[-1px] text-gray-700" />
          </p>

          <h1 className="text-4xl lg:text-5xl font-extrabold text-gray-800 leading-tight mb-6 max-w-xl">
            Download our mobile app to enjoy full access
          </h1>

          <p className="text-gray-600 text-lg mb-10 max-w-md">
            Our web version provides very limited access.
            <br />
            Download our app to {handleAction()}.
          </p>

          <div className="flex justify-center space-x-4">
            <a href="#" target="_blank" rel="noopener noreferrer">
              <img
                src="google-play-badge.png" // Google Play badge image
                alt="Get it on Google Play"
                className="h-12 w-auto"
              />
            </a>

            <a href="#" target="_blank" rel="noopener noreferrer">
              <img
                src="app-store-badge.png" // App Store badge image
                alt="Download on the App Store"
                className="h-12 w-auto"
              />
            </a>
          </div>

          <div className="absolute bottom-0 w-full">
            <MenuButton />
          </div>
      </div>
    </div>
  );
};

export default PageLocked;
