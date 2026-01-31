import React from "react";
import { Helmet } from "react-helmet-async";
import { useNavigate } from "react-router-dom";

const HowToSellPage: React.FC = () => {
  const navigate = useNavigate();

  return (
    <>
      <Helmet>
        <title>How to Sell - Oysloe</title>
        <meta
          name="description"
          content="Learn how to sell on Oysloe - create listings, manage orders, and grow your business."
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
              How to Sell on Oysloe
            </h1>

            <div className="text-left space-y-6">
              {/* Step 1 */}
              <section>
                <h2 className="text-2xl font-semibold text-(--dark-def) mb-3">
                  Step 1: Create Your Account
                </h2>
                <p className="text-gray-600 mb-2">
                  Sign up on Oysloe with your email and phone number. Verify your account to get started selling.
                </p>
              </section>

              {/* Step 2 */}
              <section>
                <h2 className="text-2xl font-semibold text-(--dark-def) mb-3">
                  Step 2: Complete Your Profile
                </h2>
                <p className="text-gray-600 mb-2">
                  Add your business name, profile photo, and description. A complete profile builds trust with buyers.
                </p>
              </section>

              {/* Step 3 */}
              <section>
                <h2 className="text-2xl font-semibold text-(--dark-def) mb-3">
                  Step 3: Create Your First Listing
                </h2>
                <p className="text-gray-600 mb-2">
                  Click "Post Ad" to create a new listing. Add clear photos, write a detailed description, and set your price.
                </p>
                <ul className="list-disc list-inside text-gray-600 ml-2 space-y-1">
                  <li>Use high-quality photos (at least 2-3 images)</li>
                  <li>Write a clear and honest description</li>
                  <li>Set a competitive price</li>
                  <li>Choose appropriate categories</li>
                </ul>
              </section>

              {/* Step 4 */}
              <section>
                <h2 className="text-2xl font-semibold text-(--dark-def) mb-3">
                  Step 4: Manage Your Listings
                </h2>
                <p className="text-gray-600 mb-2">
                  Track your active listings from your profile. You can edit, renew, or take down listings anytime.
                </p>
              </section>

              {/* Step 5 */}
              <section>
                <h2 className="text-2xl font-semibold text-(--dark-def) mb-3">
                  Step 5: Communicate with Buyers
                </h2>
                <p className="text-gray-600 mb-2">
                  Respond to buyer inquiries quickly using the messaging system. Be professional and helpful.
                </p>
              </section>

              {/* Step 6 */}
              <section>
                <h2 className="text-2xl font-semibold text-(--dark-def) mb-3">
                  Step 6: Complete the Sale
                </h2>
                <p className="text-gray-600 mb-2">
                  Agree on terms with the buyer and complete the transaction. Mark items as sold when complete.
                </p>
              </section>

              {/* Tips */}
              <section className="bg-blue-50 p-4 rounded-lg border border-blue-200">
                <h2 className="text-xl font-semibold text-(--dark-def) mb-3">
                  💡 Tips for Success
                </h2>
                <ul className="list-disc list-inside text-gray-600 space-y-2">
                  <li>Post listings during peak hours for better visibility</li>
                  <li>Renew your listings regularly to stay at the top</li>
                  <li>Respond to messages within 2 hours</li>
                  <li>Build a good rating by being honest and reliable</li>
                  <li>Use high-quality photos to attract more buyers</li>
                </ul>
              </section>

              <p className="text-gray-500 text-sm mt-4 mb-10">
                Have questions? Contact our support team or check out our FAQ section.
              </p>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default HowToSellPage;
