import React from "react";
import { Helmet } from "react-helmet-async";
import { useNavigate } from "react-router-dom";

const SellPropertyPage: React.FC = () => {
  const navigate = useNavigate();

  return (
    <>
      <Helmet>
        <title>Sell or Rent Property in Ghana | Oysloe Real Estate Marketplace</title>
        <meta
          name="description"
          content="Sell or rent your property on Oysloe marketplace in Ghana. Reach verified buyers and quality tenants. Free listings, safe transactions, professional support."
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
              🏠 Sell or Rent Property in Ghana - Real Estate Listings
            </h1>
            <p className="text-gray-600 mb-4">
              List your house, apartment, or land for sale or rent on Oysloe. Connect with serious buyers and quality tenants. Secure property transactions in Ghana.
            </p>

            <div className="text-left space-y-6">
              {/* Property Details */}
              <section>
                <h2 className="text-2xl font-semibold text-(--dark-def) mb-3">
                  Essential Property Details
                </h2>
                <ul className="list-disc list-inside text-gray-600 space-y-2 ml-2">
                  <li>Property type (House, Apartment, Land, Office, etc.)</li>
                  <li>Location and address</li>
                  <li>Size (Square meters or feet)</li>
                  <li>Number of bedrooms and bathrooms</li>
                  <li>Year built and condition</li>
                  <li>Available facilities (Pool, Garden, Parking, etc.)</li>
                  <li>Security features</li>
                  <li>Lease terms (if renting)</li>
                </ul>
              </section>

              {/* Documentation */}
              <section>
                <h2 className="text-2xl font-semibold text-(--dark-def) mb-3">
                  📋 Required Documentation
                </h2>
                <p className="text-gray-600 mb-3">Prepare these documents to help close deals faster:</p>
                <ul className="list-disc list-inside text-gray-600 space-y-2 ml-2">
                  <li>Property deed or ownership certificate</li>
                  <li>Property survey or plot plan</li>
                  <li>Utility bills (electricity, water connections)</li>
                  <li>Tax receipts and payment history</li>
                  <li>Any relevant inspection reports</li>
                  <li>Proof of legal occupancy</li>
                </ul>
              </section>

              {/* Photography Tips */}
              <section>
                <h2 className="text-2xl font-semibold text-(--dark-def) mb-3">
                  📸 Professional Photos Matter
                </h2>
                <ul className="list-disc list-inside text-gray-600 space-y-2 ml-2">
                  <li>Include exterior views and street frontage</li>
                  <li>Photograph each room in good lighting</li>
                  <li>Show the kitchen, bathrooms, and living areas</li>
                  <li>Include garden, parking, and outdoor spaces</li>
                  <li>Take shots at different times of day if possible</li>
                  <li>Use video tours to showcase the entire property</li>
                </ul>
              </section>

              {/* Pricing Strategy */}
              <section>
                <h2 className="text-2xl font-semibold text-(--dark-def) mb-3">
                  💰 Pricing Strategy
                </h2>
                <p className="text-gray-600 mb-3">Set competitive prices by considering:</p>
                <ul className="list-disc list-inside text-gray-600 space-y-2 ml-2">
                  <li>Recent comparable sales in your area</li>
                  <li>Property condition and age</li>
                  <li>Location and proximity to amenities</li>
                  <li>Market trends in your area</li>
                  <li>For rentals: comparable rental rates nearby</li>
                </ul>
              </section>

              {/* Safety */}
              <section className="bg-orange-50 p-4 rounded-lg border border-orange-200">
                <h2 className="text-xl font-semibold text-(--dark-def) mb-3">
                  ⚠️ Safety & Legal Tips
                </h2>
                <ul className="list-disc list-inside text-gray-600 space-y-2 ml-2">
                  <li>Verify buyer/tenant credentials</li>
                  <li>Schedule viewings during daylight hours</li>
                  <li>Never agree to verbal agreements only</li>
                  <li>Use proper contracts and legal documentation</li>
                  <li>Get legal advice before finalizing deals</li>
                  <li>Request references from tenants</li>
                </ul>
              </section>

              {/* Call to Action */}
              <div className="bg-green-50 border border-green-200 rounded-lg p-6 text-center">
                <p className="text-gray-600 mb-4">
                  Ready to list your property?
                </p>
                <button
                  onClick={() => navigate("/postad")}
                  className="inline-block bg-(--green) text-(--dark-def) px-6 py-3 rounded-lg font-semibold hover:opacity-90 transition"
                >
                  List Your Property Now
                </button>
              </div>

              <p className="text-gray-500 text-sm mt-6 mb-10">
                Need legal assistance? Consult with a real estate expert before finalizing your deal.
              </p>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default SellPropertyPage;
