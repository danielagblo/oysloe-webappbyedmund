import React from "react";
import { Helmet } from "react-helmet-async";
import { useNavigate } from "react-router-dom";

const SellElectronicsPage: React.FC = () => {
  const navigate = useNavigate();

  return (
    <>
      <Helmet>
        <title>How to Sell Electronics on Oysloe | Best Tips & Guide</title>
        <meta
          name="description"
          content="Complete guide on selling electronics on Oysloe. Learn best practices for listing laptops, tablets, headphones, cameras, and gadgets."
        />
      </Helmet>
      <div className="relative flex items-center justify-center w-screen sm:w-full h-full text-center max-sm:pt-10">
        <div
          className={`
            shadow-lg rounded-2xl bg-white lg:h-[93vh] px-6 py-10 sm:px-5 max-lg:pt-0 sm:py-6 w-full 
            flex flex-col items-center justify-center sm:shadow-lg sm:rounded-2xl 
            h-screen sm:h-auto overflow-auto no-scrollbar
          `}
        >
          {/* Back Button */}
          <div className="w-full flex items-start mb-4">
            <button
              onClick={() => navigate(-1)}
              className="flex items-center gap-2 text-(--dark-def) hover:opacity-70 transition font-medium text-sm sm:text-base"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
              Back
            </button>
          </div>

          <div className="flex lg:pt-15 px-5 flex-col justify-start gap-6 mb-2 w-full sm:h-[85vh] overflow-auto no-scrollbar">
            <h1 className="text-3xl sm:text-4xl font-bold text-(--dark-def) max-lg:pt-15 mb-4">
              💻 How to Sell Electronics
            </h1>

            <div className="text-left space-y-6">
              <section>
                <h2 className="text-2xl font-semibold text-(--dark-def) mb-3">
                  Get Top Value for Your Electronics
                </h2>
                <p className="text-gray-600">
                  Whether you're selling a laptop, tablet, headphones, camera, or other gadgets, Oysloe makes it easy to reach buyers in Ghana.
                </p>
              </section>

              <section>
                <h2 className="text-2xl font-semibold text-(--dark-def) mb-3">
                  📸 High-Quality Photos Tips
                </h2>
                <ul className="list-disc list-inside text-gray-600 space-y-2 ml-2">
                  <li>Take photos in natural daylight from multiple angles</li>
                  <li>Show the device from front, back, and sides</li>
                  <li>Include close-ups of any damage, scratches, or wear</li>
                  <li>Photo of the original packaging if available</li>
                  <li>Include screenshots of working features (screen, camera, etc.)</li>
                  <li>Use at least 4-6 clear photos</li>
                </ul>
              </section>

              <section>
                <h2 className="text-2xl font-semibold text-(--dark-def) mb-3">
                  💰 Pricing Strategy
                </h2>
                <ul className="list-disc list-inside text-gray-600 space-y-2 ml-2">
                  <li>Research similar listings on Oysloe for market rates</li>
                  <li>Factor in condition: excellent, good, fair, or needs repair</li>
                  <li>Consider age and current models available</li>
                  <li>Original accessories increase value by 10-20%</li>
                  <li>Set competitive prices to attract quick sales</li>
                </ul>
              </section>

              <section>
                <h2 className="text-2xl font-semibold text-(--dark-def) mb-3">
                  ✍️ What to Include in Your Listing
                </h2>
                <ul className="list-disc list-inside text-gray-600 space-y-2 ml-2">
                  <li>Brand, model, and year of manufacture</li>
                  <li>Detailed condition description</li>
                  <li>Specifications (storage, RAM, processor, etc.)</li>
                  <li>Battery health and screen condition (if applicable)</li>
                  <li>Any defects, repairs, or issues</li>
                  <li>Included accessories (charger, cable, box, etc.)</li>
                  <li>Warranty status or remaining guarantee</li>
                </ul>
              </section>

              <section>
                <h2 className="text-2xl font-semibold text-(--dark-def) mb-3">
                  🛡️ Safety & Trust Tips
                </h2>
                <ul className="list-disc list-inside text-gray-600 space-y-2 ml-2">
                  <li>Provide accurate condition information to avoid disputes</li>
                  <li>Meet in safe, public locations</li>
                  <li>Bring a friend when meeting buyers</li>
                  <li>Ask for verified buyer profiles</li>
                  <li>Never send items before receiving payment</li>
                  <li>Keep proof of transaction</li>
                </ul>
              </section>

              <section>
                <h2 className="text-2xl font-semibold text-(--dark-def) mb-3">
                  🚚 Delivery Options
                </h2>
                <ul className="list-disc list-inside text-gray-600 space-y-2 ml-2">
                  <li>Local pickup (most common for electronics)</li>
                  <li>Cash on delivery within Accra</li>
                  <li>Use Oysloe logistics for safer deliveries</li>
                  <li>Package fragile items securely</li>
                  <li>Get insurance for expensive items</li>
                </ul>
              </section>

              <p className="text-gray-500 text-sm mt-6 mb-10">
                Ready to list? Start selling your electronics on Oysloe today!
              </p>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default SellElectronicsPage;
