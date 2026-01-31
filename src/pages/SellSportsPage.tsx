import React from "react";
import { Helmet } from "react-helmet-async";
import { useNavigate } from "react-router-dom";

const SellSportsPage: React.FC = () => {
  const navigate = useNavigate();

  return (
    <>
      <Helmet>
        <title>How to Sell Sports & Fitness Gear on Oysloe | Guide</title>
        <meta
          name="description"
          content="Sell sports equipment, gym gear, fitness accessories, and apparel on Oysloe. Learn best practices for sports item listings."
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
              ⚽ How to Sell Sports & Fitness Gear
            </h1>

            <div className="text-left space-y-6">
              <section>
                <h2 className="text-2xl font-semibold text-(--dark-def) mb-3">
                  Sell Your Sports Equipment & Gear
                </h2>
                <p className="text-gray-600">
                  From gym equipment to sports apparel and accessories, sell your fitness gear to enthusiasts across Ghana.
                </p>
              </section>

              <section>
                <h2 className="text-2xl font-semibold text-(--dark-def) mb-3">
                  📸 Photography for Sports Items
                </h2>
                <ul className="list-disc list-inside text-gray-600 space-y-2 ml-2">
                  <li>Take clear photos from multiple angles</li>
                  <li>Show complete item in context (e.g., dumbbells set out)</li>
                  <li>Include close-ups of any damage or wear</li>
                  <li>Photo of brand labels and specifications</li>
                  <li>Show working condition for electronic items</li>
                  <li>Display size or scale reference</li>
                  <li>Use 6-8 quality photos</li>
                </ul>
              </section>

              <section>
                <h2 className="text-2xl font-semibold text-(--dark-def) mb-3">
                  💰 Pricing Sports Equipment
                </h2>
                <ul className="list-disc list-inside text-gray-600 space-y-2 ml-2">
                  <li>New equipment: 50-70% of retail price</li>
                  <li>Like-new (barely used): 60-75% of retail</li>
                  <li>Good condition: 40-60% of retail</li>
                  <li>Heavy/bulky items: factor in buyer retrieval difficulty</li>
                  <li>Premium brands: command higher resale value</li>
                  <li>Bundle complete sets for better prices</li>
                </ul>
              </section>

              <section>
                <h2 className="text-2xl font-semibold text-(--dark-def) mb-3">
                  ✍️ Key Details to Include
                </h2>
                <ul className="list-disc list-inside text-gray-600 space-y-2 ml-2">
                  <li>Type of equipment (treadmill, weights, yoga mat, etc.)</li>
                  <li>Brand and model number</li>
                  <li>Dimensions and weight</li>
                  <li>Condition assessment</li>
                  <li>Any signs of wear or damage</li>
                  <li>Original packaging or accessories included</li>
                  <li>For electronic items: battery health, warranty status</li>
                </ul>
              </section>

              <section>
                <h2 className="text-2xl font-semibold text-(--dark-def) mb-3">
                  🏆 Popular Categories
                </h2>
                <ul className="list-disc list-inside text-gray-600 space-y-2 ml-2">
                  <li>Gym equipment (dumbbells, kettlebells, barbells)</li>
                  <li>Cardio machines (treadmills, stationary bikes)</li>
                  <li>Sports apparel and footwear</li>
                  <li>Ball sports equipment (soccer, basketball, etc.)</li>
                  <li>Yoga and fitness accessories</li>
                  <li>Athletic watches and fitness trackers</li>
                  <li>Professional gym equipment</li>
                </ul>
              </section>

              <section>
                <h2 className="text-2xl font-semibold text-(--dark-def) mb-3">
                  🚚 Delivery Tips for Large Items
                </h2>
                <ul className="list-disc list-inside text-gray-600 space-y-2 ml-2">
                  <li>Clearly state if buyer pickup is required</li>
                  <li>Offer delivery services for a reasonable fee</li>
                  <li>Ensure buyer has proper space for large equipment</li>
                  <li>Help with setup/assembly if agreed</li>
                  <li>Document item condition before handover</li>
                </ul>
              </section>

              <section>
                <h2 className="text-2xl font-semibold text-(--dark-def) mb-3">
                  💡 Pro Tips for Faster Sales
                </h2>
                <ul className="list-disc list-inside text-gray-600 space-y-2 ml-2">
                  <li>Highlight if items are recently purchased</li>
                  <li>Mention original receipt or warranty if available</li>
                  <li>Include testimonials if you're a known seller</li>
                  <li>Offer bundle deals for multiple items</li>
                  <li>Be responsive to buyer inquiries</li>
                </ul>
              </section>

              <p className="text-gray-500 text-sm mt-6 mb-10">
                Start selling your sports equipment on Oysloe today!
              </p>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default SellSportsPage;
