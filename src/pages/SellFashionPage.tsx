import React from "react";
import { Helmet } from "react-helmet-async";
import { useNavigate } from "react-router-dom";

const SellFashionPage: React.FC = () => {
  const navigate = useNavigate();

  return (
    <>
      <Helmet>
        <title>How to Sell Fashion & Clothing on Oysloe | Best Tips</title>
        <meta
          name="description"
          content="Sell clothes, shoes, bags, and accessories on Oysloe. Learn best practices for fashion listings, pricing, and attracting buyers."
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
              👗 How to Sell Fashion & Clothing
            </h1>

            <div className="text-left space-y-6">
              <section>
                <h2 className="text-2xl font-semibold text-(--dark-def) mb-3">
                  Sell Your Designer Clothes & Accessories
                </h2>
                <p className="text-gray-600">
                  From vintage collections to brand new outfits, Oysloe helps you reach fashion enthusiasts across Ghana.
                </p>
              </section>

              <section>
                <h2 className="text-2xl font-semibold text-(--dark-def) mb-3">
                  📸 Fashion Photography Guide
                </h2>
                <ul className="list-disc list-inside text-gray-600 space-y-2 ml-2">
                  <li>Use natural daylight for accurate color representation</li>
                  <li>Take flat lay photos on clean backgrounds</li>
                  <li>Show items on a mannequin or modeled if possible</li>
                  <li>Include close-ups of fabric, stitching, and tags</li>
                  <li>Show any stains, wear, or damage clearly</li>
                  <li>Include sizing tags and brand labels</li>
                  <li>Use 5-8 quality photos from different angles</li>
                </ul>
              </section>

              <section>
                <h2 className="text-2xl font-semibold text-(--dark-def) mb-3">
                  💰 Pricing Tips for Fashion Items
                </h2>
                <ul className="list-disc list-inside text-gray-600 space-y-2 ml-2">
                  <li>Research brand retail value and condition</li>
                  <li>Designer items: 30-50% of original retail price</li>
                  <li>High street brands: 20-40% of original price</li>
                  <li>Vintage or rare items can command premium prices</li>
                  <li>Bundle similar items for better deals</li>
                  <li>Factor in season (off-season items sell cheaper)</li>
                </ul>
              </section>

              <section>
                <h2 className="text-2xl font-semibold text-(--dark-def) mb-3">
                  ✍️ Detailed Item Descriptions
                </h2>
                <ul className="list-disc list-inside text-gray-600 space-y-2 ml-2">
                  <li>Brand name and style/model number</li>
                  <li>Size and fit (XS, S, M, L, XL, etc.)</li>
                  <li>Fabric content (cotton, silk, polyester, blend, etc.)</li>
                  <li>Color and any pattern details</li>
                  <li>Condition (new, like new, gently used, worn)</li>
                  <li>Any defects (loose threads, missing buttons, stains)</li>
                  <li>Year of purchase if known</li>
                </ul>
              </section>

              <section>
                <h2 className="text-2xl font-semibold text-(--dark-def) mb-3">
                  🏆 Trending Categories to Highlight
                </h2>
                <ul className="list-disc list-inside text-gray-600 space-y-2 ml-2">
                  <li>Designer brands (boost visibility)</li>
                  <li>Vintage or retro styles</li>
                  <li>Sustainable/eco-friendly fashion</li>
                  <li>Traditional Ghanaian clothing</li>
                  <li>Wedding and special occasion wear</li>
                  <li>Athleisure and sportswear</li>
                </ul>
              </section>

              <section>
                <h2 className="text-2xl font-semibold text-(--dark-def) mb-3">
                  📦 Packing & Shipping
                </h2>
                <ul className="list-disc list-inside text-gray-600 space-y-2 ml-2">
                  <li>Use tissue paper or bubble wrap for protection</li>
                  <li>Fold items neatly to prevent wrinkles</li>
                  <li>Use a sturdy box or padded mailer</li>
                  <li>Include a thank you note for repeat customers</li>
                  <li>For local sales, offer hand delivery</li>
                </ul>
              </section>

              <p className="text-gray-500 text-sm mt-6 mb-10">
                Start selling your fashion items on Oysloe today!
              </p>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default SellFashionPage;
