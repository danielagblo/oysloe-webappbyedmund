import React from "react";
import { Helmet } from "react-helmet-async";
import { useNavigate } from "react-router-dom";

const SellBeautyPage: React.FC = () => {
  const navigate = useNavigate();

  return (
    <>
      <Helmet>
        <title>How to Sell Beauty & Personal Care on Oysloe | Guide</title>
        <meta
          name="description"
          content="Sell cosmetics, skincare, wellness products, and beauty items on Oysloe. Learn best practices for beauty product listings."
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
              💄 How to Sell Beauty & Personal Care
            </h1>

            <div className="text-left space-y-6">
              <section>
                <h2 className="text-2xl font-semibold text-(--dark-def) mb-3">
                  Sell Your Beauty & Wellness Products
                </h2>
                <p className="text-gray-600">
                  Cosmetics, skincare, wellness products, and personal care items find eager buyers on Oysloe.
                </p>
              </section>

              <section>
                <h2 className="text-2xl font-semibold text-(--dark-def) mb-3">
                  📸 Beauty Product Photography
                </h2>
                <ul className="list-disc list-inside text-gray-600 space-y-2 ml-2">
                  <li>Take clear photos in natural daylight</li>
                  <li>Show product from front and back angles</li>
                  <li>Include close-up of product label and packaging</li>
                  <li>Show expiration dates clearly</li>
                  <li>Photo of product with lid open or content visible</li>
                  <li>Display any batch codes or certification marks</li>
                  <li>Use 5-8 high-quality photos</li>
                </ul>
              </section>

              <section>
                <h2 className="text-2xl font-semibold text-(--dark-def) mb-3">
                  💰 Pricing Beauty Products
                </h2>
                <ul className="list-disc list-inside text-gray-600 space-y-2 ml-2">
                  <li>New/sealed products: 60-80% of retail</li>
                  <li>Lightly used: 40-60% of retail</li>
                  <li>Well-maintained: 30-50% of retail</li>
                  <li>Premium/luxury brands: can maintain higher value</li>
                  <li>Discontinued items: may sell at premium</li>
                  <li>Bundle similar products for bulk discounts</li>
                </ul>
              </section>

              <section>
                <h2 className="text-2xl font-semibold text-(--dark-def) mb-3">
                  ✍️ What to Include in Listing
                </h2>
                <ul className="list-disc list-inside text-gray-600 space-y-2 ml-2">
                  <li>Product name and brand</li>
                  <li>Type (makeup, skincare, haircare, fragrance, etc.)</li>
                  <li>Expiration date or best-before date</li>
                  <li>Condition (new, used once, lightly used, etc.)</li>
                  <li>Size/volume</li>
                  <li>Ingredients or product specifications</li>
                  <li>Any skin type compatibility information</li>
                  <li>Reason for sale (decluttering, duplicate, etc.)</li>
                </ul>
              </section>

              <section>
                <h2 className="text-2xl font-semibold text-(--dark-def) mb-3">
                  🛡️ Trust & Safety for Beauty Sales
                </h2>
                <ul className="list-disc list-inside text-gray-600 space-y-2 ml-2">
                  <li>Only sell authentic, original products</li>
                  <li>Clearly disclose any expiration dates</li>
                  <li>Never sell counterfeit cosmetics</li>
                  <li>Provide accurate ingredient lists if available</li>
                  <li>Disclose product usage level honestly</li>
                  <li>State whether products are sanitized/tested</li>
                </ul>
              </section>

              <section>
                <h2 className="text-2xl font-semibold text-(--dark-def) mb-3">
                  📦 Packaging for Safe Delivery
                </h2>
                <ul className="list-disc list-inside text-gray-600 space-y-2 ml-2">
                  <li>Use strong, waterproof packaging</li>
                  <li>Wrap fragile items in bubble wrap</li>
                  <li>Use padding to prevent product movement</li>
                  <li>Ensure liquids are sealed in leak-proof bags</li>
                  <li>Include product care instructions</li>
                  <li>Add thank you note for repeat customers</li>
                </ul>
              </section>

              <section>
                <h2 className="text-2xl font-semibold text-(--dark-def) mb-3">
                  💡 Popular Beauty Categories
                </h2>
                <ul className="list-disc list-inside text-gray-600 space-y-2 ml-2">
                  <li>Skincare (creams, serums, cleansers)</li>
                  <li>Makeup (foundations, lipsticks, eyeshadows)</li>
                  <li>Haircare products and treatments</li>
                  <li>Fragrances and perfumes</li>
                  <li>Natural and organic beauty products</li>
                  <li>Wellness supplements and vitamins</li>
                  <li>Professional beauty tools</li>
                </ul>
              </section>

              <p className="text-gray-500 text-sm mt-6 mb-10">
                Start selling your beauty products on Oysloe today!
              </p>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default SellBeautyPage;
