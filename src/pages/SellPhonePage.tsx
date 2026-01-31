import React from "react";
import { Helmet } from "react-helmet-async";
import { useNavigate } from "react-router-dom";

const SellPhonePage: React.FC = () => {
  const navigate = useNavigate();

  return (
    <>
      <Helmet>
        <title>Sell Your Phone on Oysloe | Best Prices for Used Phones Ghana</title>
        <meta
          name="description"
          content="Sell your used phone on Oysloe marketplace in Ghana. iPhone, Samsung, and all brands. Quick listings, verified buyers, safe mobile payments."
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

          <div className="flex lg:pt-15 px-5 flex-col justify-start gap-4 mb-2 w-full sm:h-[85vh] overflow-auto no-scrollbar">
            <h1 className="text-3xl sm:text-4xl font-bold text-(--dark-def) max-lg:pt-15 mb-4">
              📱 Sell a Phone - Best Mobile Marketplace Ghana
            </h1>
            <p className="text-gray-600 mb-4">
              Sell your used phone (iPhone, Samsung, Tecno, etc.) on Oysloe. Get top prices, reach interested buyers, and complete secure transactions.
            </p>

            <div className="text-left space-y-6">
              {/* Phone Details */}
              <section>
                <h2 className="text-2xl font-semibold text-(--dark-def) mb-3">
                  Key Phone Information
                </h2>
                <ul className="list-disc list-inside text-gray-600 space-y-2 ml-2">
                  <li>Brand and model (e.g., iPhone 14, Samsung Galaxy S23)</li>
                  <li>Storage capacity (64GB, 128GB, 256GB, etc.)</li>
                  <li>Color and condition (Like new, Good, Fair, Used)</li>
                  <li>Operating system version</li>
                  <li>Battery health percentage</li>
                  <li>Any damage (Scratches, cracks, water damage)</li>
                  <li>IMEI number and activation lock status</li>
                  <li>Included accessories (Charger, cable, box)</li>
                </ul>
              </section>

              {/* Condition Assessment */}
              <section>
                <h2 className="text-2xl font-semibold text-(--dark-def) mb-3">
                  Condition Grading
                </h2>
                <div className="space-y-3">
                  <div className="border border-gray-200 p-3 rounded">
                    <p className="font-semibold text-gray-800">Like New</p>
                    <p className="text-gray-600 text-sm">No scratches, fully functional, original packaging</p>
                  </div>
                  <div className="border border-gray-200 p-3 rounded">
                    <p className="font-semibold text-gray-800">Excellent</p>
                    <p className="text-gray-600 text-sm">Minimal signs of use, all functions work perfectly</p>
                  </div>
                  <div className="border border-gray-200 p-3 rounded">
                    <p className="font-semibold text-gray-800">Good</p>
                    <p className="text-gray-600 text-sm">Some visible use, all features functional</p>
                  </div>
                  <div className="border border-gray-200 p-3 rounded">
                    <p className="font-semibold text-gray-800">Fair</p>
                    <p className="text-gray-600 text-sm">Noticeable wear, may have minor issues</p>
                  </div>
                </div>
              </section>

              {/* Photography Tips */}
              <section>
                <h2 className="text-2xl font-semibold text-(--dark-def) mb-3">
                  📸 Photography Tips
                </h2>
                <ul className="list-disc list-inside text-gray-600 space-y-2 ml-2">
                  <li>Take clear photos of the phone from all angles</li>
                  <li>Show the screen with it turned on (if working)</li>
                  <li>Highlight any damage or wear clearly</li>
                  <li>Include photos with accessories if included</li>
                  <li>Use good lighting to show true color</li>
                  <li>Close-up shots of condition details</li>
                </ul>
              </section>

              {/* Pricing Guide */}
              <section>
                <h2 className="text-2xl font-semibold text-(--dark-def) mb-3">
                  💰 Pricing Guidelines
                </h2>
                <p className="text-gray-600 mb-3">Price your phone based on:</p>
                <ul className="list-disc list-inside text-gray-600 space-y-2 ml-2">
                  <li>Current market value for the model</li>
                  <li>Phone condition (depreciation for damage)</li>
                  <li>Storage capacity and features</li>
                  <li>Battery health and age</li>
                  <li>Similar listings on Oysloe</li>
                  <li>Original retail price</li>
                </ul>
              </section>

              {/* Safety */}
              <section className="bg-orange-50 p-4 rounded-lg border border-orange-200">
                <h2 className="text-xl font-semibold text-(--dark-def) mb-3">
                  ⚠️ Security & Safety
                </h2>
                <ul className="list-disc list-inside text-gray-600 space-y-2 ml-2">
                  <li>Factory reset phone before handing over</li>
                  <li>Remove SIM card and SD card if applicable</li>
                  <li>Verify IMEI with buyer before sale</li>
                  <li>Meet in safe, public locations</li>
                  <li>Test phone functionality with buyer present</li>
                  <li>Get payment confirmation before handing over device</li>
                  <li>Use Oysloe's verified payment options</li>
                </ul>
              </section>

              {/* Call to Action */}
              <div className="bg-green-50 border border-green-200 rounded-lg p-6 text-center">
                <p className="text-gray-600 mb-4">
                  Ready to sell your phone?
                </p>
                <button
                  onClick={() => navigate("/postad")}
                  className="inline-block bg-(--green) text-(--dark-def) px-6 py-3 rounded-lg font-semibold hover:opacity-90 transition"
                >
                  Sell Your Phone Now
                </button>
              </div>

              <p className="text-gray-500 text-sm mt-6 mb-10">
                Pro tip: Phones in good condition sell faster. Be honest about any issues.
              </p>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default SellPhonePage;
