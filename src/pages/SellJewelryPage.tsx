import React from "react";
import { Helmet } from "react-helmet-async";
import { useNavigate } from "react-router-dom";

const SellJewelryPage: React.FC = () => {
  const navigate = useNavigate();

  return (
    <>
      <Helmet>
        <title>How to Sell Jewelry & Watches on Oysloe | Guide</title>
        <meta
          name="description"
          content="Sell rings, necklaces, bracelets, watches, and jewelry on Oysloe. Learn best practices for jewelry listings and pricing."
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
              💍 How to Sell Jewelry & Watches
            </h1>

            <div className="text-left space-y-6">
              <section>
                <h2 className="text-2xl font-semibold text-(--dark-def) mb-3">
                  Sell Your Jewelry & Timepieces
                </h2>
                <p className="text-gray-600">
                  Rings, necklaces, bracelets, watches, and accessories attract serious buyers on Oysloe. Sell your luxury items securely.
                </p>
              </section>

              <section>
                <h2 className="text-2xl font-semibold text-(--dark-def) mb-3">
                  📸 Jewelry Photography Tips
                </h2>
                <ul className="list-disc list-inside text-gray-600 space-y-2 ml-2">
                  <li>Use bright, natural daylight for accurate colors</li>
                  <li>Take multiple close-up shots of details</li>
                  <li>Show jewelry from different angles</li>
                  <li>Include photos of hallmarks, maker's marks, or certifications</li>
                  <li>Photo of jewelry on a model if possible</li>
                  <li>Display any gemstones or diamonds clearly</li>
                  <li>Use white or neutral backgrounds</li>
                  <li>Use 8-12 high-quality photos</li>
                </ul>
              </section>

              <section>
                <h2 className="text-2xl font-semibold text-(--dark-def) mb-3">
                  💰 Jewelry Pricing Strategy
                </h2>
                <ul className="list-disc list-inside text-gray-600 space-y-2 ml-2">
                  <li>Gold/precious metals: Based on weight and purity</li>
                  <li>Designer items: 50-70% of retail value</li>
                  <li>Vintage/antique: Research comparable sales</li>
                  <li>Gemstone quality: Affects value significantly</li>
                  <li>Branded watches: 60-80% of retail for recent models</li>
                  <li>Condition and authenticity: Critical for pricing</li>
                  <li>Get professional appraisal for high-value items</li>
                </ul>
              </section>

              <section>
                <h2 className="text-2xl font-semibold text-(--dark-def) mb-3">
                  ✍️ Detailed Item Information
                </h2>
                <ul className="list-disc list-inside text-gray-600 space-y-2 ml-2">
                  <li>Type (ring, necklace, bracelet, watch, etc.)</li>
                  <li>Brand and designer name</li>
                  <li>Metal type (gold, silver, platinum, stainless steel)</li>
                  <li>Metal purity (18K, 14K, 925, etc.)</li>
                  <li>Gemstone details (diamond, ruby, sapphire, etc.)</li>
                  <li>Stone clarity and quality if applicable</li>
                  <li>Approximate weight or dimensions</li>
                  <li>Condition and any wear marks</li>
                  <li>Authenticity certificates if available</li>
                </ul>
              </section>

              <section>
                <h2 className="text-2xl font-semibold text-(--dark-def) mb-3">
                  🛡️ Authenticity & Trust
                </h2>
                <ul className="list-disc list-inside text-gray-600 space-y-2 ml-2">
                  <li>Only sell authentic, genuine jewelry</li>
                  <li>Provide certificates of authenticity if available</li>
                  <li>Include appraisal documents for valuable items</li>
                  <li>Be transparent about any repairs or modifications</li>
                  <li>State hallmarks and maker's marks clearly</li>
                  <li>Allow inspections before final payment</li>
                  <li>Offer return policy for peace of mind</li>
                </ul>
              </section>

              <section>
                <h2 className="text-2xl font-semibold text-(--dark-def) mb-3">
                  📦 Safe Packing & Delivery
                </h2>
                <ul className="list-disc list-inside text-gray-600 space-y-2 ml-2">
                  <li>Use jewelry boxes or protective cases</li>
                  <li>Wrap items in soft cloth or tissue paper</li>
                  <li>Use padded shipping envelopes or boxes</li>
                  <li>Insure high-value shipments</li>
                  <li>Track delivery for valuable items</li>
                  <li>Require signature confirmation on delivery</li>
                  <li>Document all items with photos before shipping</li>
                </ul>
              </section>

              <section>
                <h2 className="text-2xl font-semibold text-(--dark-def) mb-3">
                  ⌚ Watch-Specific Tips
                </h2>
                <ul className="list-disc list-inside text-gray-600 space-y-2 ml-2">
                  <li>Show watch face and case condition clearly</li>
                  <li>Include photos of watch movement if mechanical</li>
                  <li>Mention any servicing or maintenance history</li>
                  <li>State battery condition or replacement needs</li>
                  <li>Include strap condition and any scratches</li>
                  <li>Provide original box and documentation if available</li>
                  <li>Note water resistance and special features</li>
                </ul>
              </section>

              <section>
                <h2 className="text-2xl font-semibold text-(--dark-def) mb-3">
                  💡 Pro Tips for Jewelry Sales
                </h2>
                <ul className="list-disc list-inside text-gray-600 space-y-2 ml-2">
                  <li>Highlight if items are handmade or bespoke</li>
                  <li>Mention any special occasions or stories</li>
                  <li>Offer gift wrapping for occasions</li>
                  <li>Be responsive to buyer questions about authenticity</li>
                  <li>Consider meeting for in-person transactions for high-value items</li>
                </ul>
              </section>

              <p className="text-gray-500 text-sm mt-6 mb-10">
                Start selling your jewelry on Oysloe today!
              </p>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default SellJewelryPage;
