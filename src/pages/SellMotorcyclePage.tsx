import React from "react";
import { Helmet } from "react-helmet-async";
import { useNavigate } from "react-router-dom";

const SellMotorcyclePage: React.FC = () => {
  const navigate = useNavigate();

  return (
    <>
      <Helmet>
        <title>How to Sell Motorcycles & Bikes on Oysloe | Guide</title>
        <meta
          name="description"
          content="Sell your motorcycle or bike on Oysloe. Learn best practices for listing, pricing, and connecting with interested buyers in Ghana."
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
              🏍️ How to Sell Motorcycles & Bikes
            </h1>

            <div className="text-left space-y-6">
              <section>
                <h2 className="text-2xl font-semibold text-(--dark-def) mb-3">
                  Sell Your Motorcycle Quickly
                </h2>
                <p className="text-gray-600">
                  Reach buyers interested in motorcycles, bikes, and scooters across Ghana on Oysloe.
                </p>
              </section>

              <section>
                <h2 className="text-2xl font-semibold text-(--dark-def) mb-3">
                  📸 Photography Tips
                </h2>
                <ul className="list-disc list-inside text-gray-600 space-y-2 ml-2">
                  <li>Take clear photos in daylight</li>
                  <li>Show bike from front, side, back, and above</li>
                  <li>Include close-ups of odometer/mileage</li>
                  <li>Photo of any damage or wear marks</li>
                  <li>Show dashboard and control panels</li>
                  <li>Include photos of tires condition</li>
                  <li>Use 8-12 quality photos</li>
                </ul>
              </section>

              <section>
                <h2 className="text-2xl font-semibold text-(--dark-def) mb-3">
                  💰 Motorcycle Pricing Guide
                </h2>
                <ul className="list-disc list-inside text-gray-600 space-y-2 ml-2">
                  <li>Research similar bikes on Oysloe and other platforms</li>
                  <li>Factor in mileage and year of manufacture</li>
                  <li>Condition impacts price: excellent, good, fair, needs work</li>
                  <li>Recent maintenance and servicing adds value</li>
                  <li>Popular models sell faster at competitive prices</li>
                </ul>
              </section>

              <section>
                <h2 className="text-2xl font-semibold text-(--dark-def) mb-3">
                  ✍️ Key Information to Include
                </h2>
                <ul className="list-disc list-inside text-gray-600 space-y-2 ml-2">
                  <li>Make, model, and year</li>
                  <li>Engine capacity (CC)</li>
                  <li>Mileage and service history</li>
                  <li>Color and any custom modifications</li>
                  <li>Registration status (registered, transferable)</li>
                  <li>Any mechanical issues or repairs needed</li>
                  <li>Type of fuel (petrol, diesel, etc.)</li>
                  <li>Transmission type (manual, automatic)</li>
                </ul>
              </section>

              <section>
                <h2 className="text-2xl font-semibold text-(--dark-def) mb-3">
                  🛡️ Important for Motorcycle Sales
                </h2>
                <ul className="list-disc list-inside text-gray-600 space-y-2 ml-2">
                  <li>Verify buyer has valid driving license</li>
                  <li>Check buyer's ID and references</li>
                  <li>Meet in safe, public locations</li>
                  <li>Bring someone with you to viewings</li>
                  <li>Complete all documentation properly</li>
                  <li>Keep proof of sale and transaction</li>
                  <li>Never sign over documents before payment</li>
                </ul>
              </section>

              <section>
                <h2 className="text-2xl font-semibold text-(--dark-def) mb-3">
                  📋 Documentation Tips
                </h2>
                <ul className="list-disc list-inside text-gray-600 space-y-2 ml-2">
                  <li>Have all registration documents ready</li>
                  <li>Prepare transfer of ownership forms</li>
                  <li>Provide maintenance records if available</li>
                  <li>Insurance clearance certificate</li>
                  <li>Roadworthiness certificate or inspection report</li>
                </ul>
              </section>

              <p className="text-gray-500 text-sm mt-6 mb-10">
                List your motorcycle on Oysloe today and find buyers quickly!
              </p>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default SellMotorcyclePage;
