import React from "react";
import { Helmet } from "react-helmet-async";
import { useNavigate } from "react-router-dom";

const SellFurniturePage: React.FC = () => {
  const navigate = useNavigate();

  return (
    <>
      <Helmet>
        <title>How to Sell Furniture on Oysloe | Guide & Tips</title>
        <meta
          name="description"
          content="Sell furniture on Oysloe - sofas, tables, beds, chairs, decor. Learn best practices for pricing, photographing, and delivering furniture items."
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
              🪑 How to Sell Furniture
            </h1>

            <div className="text-left space-y-6">
              <section>
                <h2 className="text-2xl font-semibold text-(--dark-def) mb-3">
                  Sell Your Furniture with Ease
                </h2>
                <p className="text-gray-600">
                  Whether it's sofas, tables, beds, chairs, or home decor, Oysloe helps you find buyers for your furniture in Ghana.
                </p>
              </section>

              <section>
                <h2 className="text-2xl font-semibold text-(--dark-def) mb-3">
                  📸 Best Photography Practices
                </h2>
                <ul className="list-disc list-inside text-gray-600 space-y-2 ml-2">
                  <li>Take photos in good lighting (daylight preferred)</li>
                  <li>Show the complete piece from all angles</li>
                  <li>Include close-ups of any damage or wear</li>
                  <li>Photo in a living room setting if possible</li>
                  <li>Show dimensions using a reference object</li>
                  <li>Include detail shots of fabric, joints, and finishes</li>
                  <li>Use 6-10 clear photos</li>
                </ul>
              </section>

              <section>
                <h2 className="text-2xl font-semibold text-(--dark-def) mb-3">
                  💰 Pricing Your Furniture
                </h2>
                <ul className="list-disc list-inside text-gray-600 space-y-2 ml-2">
                  <li>Research similar furniture on Oysloe and other sites</li>
                  <li>New furniture: 40-60% of retail price</li>
                  <li>Well-maintained: 30-50% of original price</li>
                  <li>Vintage or antique: can command higher prices</li>
                  <li>Custom or designer pieces: 50-70% of retail</li>
                  <li>Factor in condition and market demand</li>
                </ul>
              </section>

              <section>
                <h2 className="text-2xl font-semibold text-(--dark-def) mb-3">
                  ✍️ Detailed Item Information
                </h2>
                <ul className="list-disc list-inside text-gray-600 space-y-2 ml-2">
                  <li>Type of furniture (sofa, bed, table, chair, etc.)</li>
                  <li>Brand and style name if known</li>
                  <li>Dimensions (length, width, height)</li>
                  <li>Material (wood type, fabric, metal, leather, etc.)</li>
                  <li>Color and any patterns</li>
                  <li>Overall condition assessment</li>
                  <li>Any stains, tears, scratches, or damage</li>
                  <li>Year of purchase if known</li>
                </ul>
              </section>

              <section>
                <h2 className="text-2xl font-semibold text-(--dark-def) mb-3">
                  🚚 Delivery Considerations
                </h2>
                <ul className="list-disc list-inside text-gray-600 space-y-2 ml-2">
                  <li>Large items may require special delivery arrangements</li>
                  <li>Offer local delivery for buyers within Accra</li>
                  <li>Consider assembly/disassembly costs</li>
                  <li>Use delivery services for long-distance items</li>
                  <li>Clearly state delivery policies in listing</li>
                  <li>Charge reasonable delivery fees or include in price</li>
                </ul>
              </section>

              <section>
                <h2 className="text-2xl font-semibold text-(--dark-def) mb-3">
                  🛡️ Safety Tips for Furniture Sales
                </h2>
                <ul className="list-disc list-inside text-gray-600 space-y-2 ml-2">
                  <li>Meet buyers in safe locations</li>
                  <li>Bring someone with you to viewings</li>
                  <li>Verify buyer identity before delivery</li>
                  <li>Document condition with photos before pickup</li>
                  <li>Keep transaction records</li>
                </ul>
              </section>

              <p className="text-gray-500 text-sm mt-6 mb-10">
                Start listing your furniture on Oysloe today!
              </p>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default SellFurniturePage;
