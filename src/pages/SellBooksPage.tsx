import React from "react";
import { Helmet } from "react-helmet-async";
import { useNavigate } from "react-router-dom";

const SellBooksPage: React.FC = () => {
  const navigate = useNavigate();

  return (
    <>
      <Helmet>
        <title>How to Sell Books & Media on Oysloe | Guide</title>
        <meta
          name="description"
          content="Sell books, textbooks, novels, magazines, and educational materials on Oysloe. Learn best practices for book listings."
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
              📚 How to Sell Books & Media
            </h1>

            <div className="text-left space-y-6">
              <section>
                <h2 className="text-2xl font-semibold text-(--dark-def) mb-3">
                  Sell Your Books & Educational Materials
                </h2>
                <p className="text-gray-600">
                  Textbooks, novels, magazines, and educational materials find eager buyers on Oysloe. Clean out your bookshelf and make money!
                </p>
              </section>

              <section>
                <h2 className="text-2xl font-semibold text-(--dark-def) mb-3">
                  📸 Book Photography Tips
                </h2>
                <ul className="list-disc list-inside text-gray-600 space-y-2 ml-2">
                  <li>Take clear photos of the cover (front and back)</li>
                  <li>Show book spine and any damage</li>
                  <li>Include close-ups of ISBN and publication details</li>
                  <li>Photo of the inside pages if relevant</li>
                  <li>Show any highlighting, notes, or writing</li>
                  <li>Display dust jacket if available</li>
                  <li>Use clean, well-lit backgrounds</li>
                </ul>
              </section>

              <section>
                <h2 className="text-2xl font-semibold text-(--dark-def) mb-3">
                  💰 Book Pricing Strategy
                </h2>
                <ul className="list-disc list-inside text-gray-600 space-y-2 ml-2">
                  <li>New books: 40-60% of retail price</li>
                  <li>Like-new (unread): 50-70% of retail</li>
                  <li>Good condition: 30-50% of retail</li>
                  <li>Fair condition: 20-30% of retail</li>
                  <li>Textbooks: Often sell at 50-70% depending on edition</li>
                  <li>Rare or collector's editions: Research comparable sales</li>
                  <li>Bundle similar books for better deals</li>
                </ul>
              </section>

              <section>
                <h2 className="text-2xl font-semibold text-(--dark-def) mb-3">
                  ✍️ What to Include in Your Listing
                </h2>
                <ul className="list-disc list-inside text-gray-600 space-y-2 ml-2">
                  <li>Title and author name</li>
                  <li>ISBN and publisher information</li>
                  <li>Publication year and edition number</li>
                  <li>Condition (new, like new, good, fair, poor)</li>
                  <li>Language (English, Twi, etc.)</li>
                  <li>Any highlighting, underlining, or notes inside</li>
                  <li>Damage: torn pages, stains, spine damage</li>
                  <li>Completeness: all pages included, dust jacket intact</li>
                </ul>
              </section>

              <section>
                <h2 className="text-2xl font-semibold text-(--dark-def) mb-3">
                  📖 Book Categories That Sell Well
                </h2>
                <ul className="list-disc list-inside text-gray-600 space-y-2 ml-2">
                  <li>School and university textbooks</li>
                  <li>Professional certifications and study guides (IELTS, WAEC)</li>
                  <li>Fiction and bestseller novels</li>
                  <li>Self-help and personal development</li>
                  <li>Children's and young adult books</li>
                  <li>Technical and computing books</li>
                  <li>Rare and first edition books</li>
                </ul>
              </section>

              <section>
                <h2 className="text-2xl font-semibold text-(--dark-def) mb-3">
                  📦 Packaging Books for Delivery
                </h2>
                <ul className="list-disc list-inside text-gray-600 space-y-2 ml-2">
                  <li>Use padded envelopes or boxes</li>
                  <li>Protect with bubble wrap for fragile editions</li>
                  <li>Avoid moisture damage with plastic wrapping</li>
                  <li>Include a thank you note for repeat customers</li>
                  <li>Offer local pickup to avoid shipping hassles</li>
                </ul>
              </section>

              <p className="text-gray-500 text-sm mt-6 mb-10">
                Start selling your book collection on Oysloe today!
              </p>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default SellBooksPage;
