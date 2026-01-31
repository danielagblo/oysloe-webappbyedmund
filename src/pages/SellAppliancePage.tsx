import React from "react";
import { Helmet } from "react-helmet-async";
import { useNavigate } from "react-router-dom";

const SellAppliancePage: React.FC = () => {
  const navigate = useNavigate();

  return (
    <>
      <Helmet>
        <title>Sell Home Appliances on Oysloe | Kitchen & Electronics Marketplace</title>
        <meta
          name="description"
          content="Sell refrigerators, washing machines, air conditioners and all home appliances on Oysloe Ghana. Find local buyers, free listings, verified transactions."
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
              🔧 Sell Home Appliances - Kitchen & Electronics Marketplace
            </h1>
            <p className="text-gray-600 mb-4">
              Sell your appliances (refrigerator, washing machine, AC, microwave, etc.) on Oysloe. Connect with local buyers and get the best prices for your items.
            </p>

            <div className="text-left space-y-6">
              {/* Appliance Types */}
              <section>
                <h2 className="text-2xl font-semibold text-(--dark-def) mb-3">
                  Popular Appliances to Sell
                </h2>
                <div className="grid grid-cols-2 gap-3">
                  <div className="p-3 rounded border" style={{backgroundColor: 'rgba(116, 255, 167, 0.1)', borderColor: 'rgba(116, 255, 167, 0.3)'}}>
                    <p className="font-semibold text-gray-800">Kitchen</p>
                    <p className="text-sm text-gray-600">Refrigerators, Ovens, Microwaves</p>
                  </div>
                  <div className="p-3 rounded border" style={{backgroundColor: 'rgba(116, 255, 167, 0.1)', borderColor: 'rgba(116, 255, 167, 0.3)'}}>
                    <p className="font-semibold text-gray-800">Laundry</p>
                    <p className="text-sm text-gray-600">Washing Machines, Dryers</p>
                  </div>
                  <div className="p-3 rounded border" style={{backgroundColor: 'rgba(116, 255, 167, 0.1)', borderColor: 'rgba(116, 255, 167, 0.3)'}}>
                    <p className="font-semibold text-gray-800">Cooling</p>
                    <p className="text-sm text-gray-600">Air Conditioners, Fans</p>
                  </div>
                  <div className="p-3 rounded border" style={{backgroundColor: 'rgba(116, 255, 167, 0.1)', borderColor: 'rgba(116, 255, 167, 0.3)'}}>
                    <p className="font-semibold text-gray-800">Heating</p>
                    <p className="text-sm text-gray-600">Water Heaters, Boilers</p>
                  </div>
                </div>
              </section>

              {/* Details to Include */}
              <section>
                <h2 className="text-2xl font-semibold text-(--dark-def) mb-3">
                  Details to Include in Your Listing
                </h2>
                <ul className="list-disc list-inside text-gray-600 space-y-2 ml-2">
                  <li>Brand name and model number</li>
                  <li>Year of manufacture and current age</li>
                  <li>Condition (Working perfectly, Minor issues, Needs repair)</li>
                  <li>Warranty status (if still under warranty)</li>
                  <li>Size and color</li>
                  <li>Energy consumption rating if available</li>
                  <li>Any special features or functions</li>
                  <li>Service history and maintenance records</li>
                </ul>
              </section>

              {/* Photography Tips */}
              <section>
                <h2 className="text-2xl font-semibold text-(--dark-def) mb-3">
                  📸 Photography Tips
                </h2>
                <ul className="list-disc list-inside text-gray-600 space-y-2 ml-2">
                  <li>Take clear photos from multiple angles</li>
                  <li>Show the appliance in working condition if possible</li>
                  <li>Photograph the model number and specifications</li>
                  <li>Include close-ups of any damage or wear</li>
                  <li>Show it in situ (in your kitchen/home) for context</li>
                  <li>Use natural lighting for accurate color representation</li>
                </ul>
              </section>

              {/* Pricing Tips */}
              <section>
                <h2 className="text-2xl font-semibold text-(--dark-def) mb-3">
                  💰 Pricing Your Appliance
                </h2>
                <p className="text-gray-600 mb-3">Consider these factors when pricing:</p>
                <ul className="list-disc list-inside text-gray-600 space-y-2 ml-2">
                  <li>Original retail price</li>
                  <li>Current age and depreciation</li>
                  <li>Condition (Working vs. needs repair)</li>
                  <li>Current market prices for similar items</li>
                  <li>Brand reputation and desirability</li>
                  <li>Energy efficiency ratings</li>
                  <li>Remaining warranty (if any)</li>
                </ul>
              </section>

              {/* Delivery Considerations */}
              <section>
                <h2 className="text-2xl font-semibold text-(--dark-def) mb-3">
                  🚚 Delivery & Logistics
                </h2>
                <ul className="list-disc list-inside text-gray-600 space-y-2 ml-2">
                  <li>Clearly state if delivery is included in the price</li>
                  <li>Provide delivery location range</li>
                  <li>Mention installation services if applicable</li>
                  <li>Specify pickup only vs. delivery options</li>
                  <li>Discuss any removal of old appliance</li>
                </ul>
              </section>

              {/* Safety */}
              <section className="bg-orange-50 p-4 rounded-lg border border-orange-200">
                <h2 className="text-xl font-semibold text-(--dark-def) mb-3">
                  ⚠️ Safety Precautions
                </h2>
                <ul className="list-disc list-inside text-gray-600 space-y-2 ml-2">
                  <li>Be honest about appliance condition and functionality</li>
                  <li>Have buyer test the appliance before payment</li>
                  <li>Ensure safe handling during delivery</li>
                  <li>Meet in daylight for viewings</li>
                  <li>Don't accept checks or unverified payments</li>
                  <li>Use Oysloe's secure payment system</li>
                </ul>
              </section>

              {/* Call to Action */}
              <div className="bg-green-50 border border-green-200 rounded-lg p-6 text-center">
                <p className="text-gray-600 mb-4">
                  Ready to sell your appliance?
                </p>
                <button
                  onClick={() => navigate("/postad")}
                  className="inline-block bg-(--green) text-(--dark-def) px-6 py-3 rounded-lg font-semibold hover:opacity-90 transition"
                >
                  List Your Appliance Now
                </button>
              </div>

              <p className="text-gray-500 text-sm mt-6 mb-10">
                Working appliances in good condition attract more buyers and sell faster!
              </p>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default SellAppliancePage;
