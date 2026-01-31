import React from "react";
import { Helmet } from "react-helmet-async";
import { useNavigate } from "react-router-dom";

const SellCarPage: React.FC = () => {
  const navigate = useNavigate();

  return (
    <>
      <Helmet>
        <title>Sell Your Car on Oysloe | Fast & Safe Car Marketplace Ghana</title>
        <meta
          name="description"
          content="Sell your used car on Oysloe marketplace in Ghana. Reach qualified buyers instantly. Free listings, secure payments, professional buyer verification."
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
              🚗 Sell a Car on Oysloe - Ghana's Car Marketplace
            </h1>
            <p className="text-gray-600 mb-4">
              Sell your used car safely and quickly on Oysloe. Get instant visibility to thousands of buyers in Ghana. No hidden fees, transparent pricing, secure transactions.
            </p>

            <div className="text-left space-y-6">
              {/* What to Include */}
              <section>
                <h2 className="text-2xl font-semibold text-(--dark-def) mb-3">
                  What Information to Include
                </h2>
                <ul className="list-disc list-inside text-gray-600 space-y-2 ml-2">
                  <li>Brand, model, and year</li>
                  <li>Mileage and condition</li>
                  <li>Color and transmission type (Manual/Automatic)</li>
                  <li>Fuel type (Petrol, Diesel, Hybrid, Electric)</li>
                  <li>Number of owners and service history</li>
                  <li>Any accidents or damage history</li>
                  <li>Registration status and documentation</li>
                </ul>
              </section>

              {/* Photography Tips */}
              <section>
                <h2 className="text-2xl font-semibold text-(--dark-def) mb-3">
                  📸 Photography Tips
                </h2>
                <ul className="list-disc list-inside text-gray-600 space-y-2 ml-2">
                  <li>Take photos in natural daylight from multiple angles</li>
                  <li>Include exterior shots (front, back, sides)</li>
                  <li>Take clear photos of the interior and dashboard</li>
                  <li>Show the tires and undercarriage if applicable</li>
                  <li>Include photos of any special features</li>
                  <li>Avoid reflections and shadows where possible</li>
                </ul>
              </section>

              {/* Pricing Tips */}
              <section>
                <h2 className="text-2xl font-semibold text-(--dark-def) mb-3">
                  💰 Pricing Tips
                </h2>
                <p className="text-gray-600 mb-3">
                  Price your car competitively by considering:
                </p>
                <ul className="list-disc list-inside text-gray-600 space-y-2 ml-2">
                  <li>Market value for the year and model</li>
                  <li>Current condition and mileage</li>
                  <li>Special features or upgrades</li>
                  <li>Local market demand</li>
                  <li>Similar listings in your area</li>
                </ul>
              </section>

              {/* Safety */}
              <section className="bg-orange-50 p-4 rounded-lg border border-orange-200">
                <h2 className="text-xl font-semibold text-(--dark-def) mb-3">
                  ⚠️ Safety Guidelines
                </h2>
                <ul className="list-disc list-inside text-gray-600 space-y-2 ml-2">
                  <li>Meet buyers in a safe, public location</li>
                  <li>Never share your home address or personal details</li>
                  <li>Bring someone with you to viewings</li>
                  <li>Verify buyer's credentials before test drives</li>
                  <li>Use Oysloe's messaging system for initial contact</li>
                </ul>
              </section>

              {/* Call to Action */}
              <div className="bg-green-50 border border-green-200 rounded-lg p-6 text-center">
                <p className="text-gray-600 mb-4">
                  Ready to sell your car?
                </p>
                <button
                  onClick={() => navigate("/postad")}
                  className="inline-block bg-(--green) text-(--dark-def) px-6 py-3 rounded-lg font-semibold hover:opacity-90 transition"
                >
                  Post Your Car Now
                </button>
              </div>

              <p className="text-gray-500 text-sm mt-6 mb-10">
                Need help? Contact our support team for assistance.
              </p>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default SellCarPage;
