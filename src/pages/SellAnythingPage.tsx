import React from "react";
import { Helmet } from "react-helmet-async";
import { useNavigate } from "react-router-dom";

const SellAnythingPage: React.FC = () => {
  const navigate = useNavigate();

  const categories = [
    {
      title: "Sell a Car",
      description: "List your vehicle and connect with interested buyers",
      path: "/sell/car",
      icon: "🚗",
    },
    {
      title: "Sell or Rent Property",
      description: "Find tenants or buyers for your property",
      path: "/sell/property",
      icon: "🏠",
    },
    {
      title: "Sell a Phone",
      description: "Quick and easy phone selling with verified buyers",
      path: "/sell/phone",
      icon: "📱",
    },
    {
      title: "Sell Home Appliances",
      description: "List your appliances and reach local buyers",
      path: "/sell/appliance",
      icon: "🔧",
    },
    {
      title: "Sell Electronics & Gadgets",
      description: "Laptops, tablets, headphones, cameras, and more",
      path: "/sell/electronics",
      icon: "💻",
    },
    {
      title: "Sell Fashion & Clothing",
      description: "Designer clothes, shoes, bags, and accessories",
      path: "/sell/fashion",
      icon: "👗",
    },
    {
      title: "Sell Furniture",
      description: "Sofas, tables, beds, chairs, and home decor",
      path: "/sell/furniture",
      icon: "🪑",
    },
    {
      title: "Sell Motorcycles & Bikes",
      description: "Sell your bike or motorcycle to interested buyers",
      path: "/sell/motorcycle",
      icon: "🏍️",
    },
    {
      title: "Sell Books & Media",
      description: "Textbooks, novels, magazines, and educational materials",
      path: "/sell/books",
      icon: "📚",
    },
    {
      title: "Sell Sports & Fitness",
      description: "Equipment, gym gear, sports accessories, and apparel",
      path: "/sell/sports",
      icon: "⚽",
    },
    {
      title: "Sell Beauty & Personal Care",
      description: "Cosmetics, skincare, wellness products, and more",
      path: "/sell/beauty",
      icon: "💄",
    },
    {
      title: "Sell Jewelry & Watches",
      description: "Rings, necklaces, bracelets, watches, and accessories",
      path: "/sell/jewelry",
      icon: "💍",
    },
  ];

  return (
    <>
      <Helmet>
        <title>Sell Anything on Oysloe | Ghana's #1 Online Marketplace</title>
        <meta
          name="description"
          content="Sell cars, property, phones, appliances, electronics, fashion, furniture, bikes, books, sports, beauty products and jewelry on Oysloe. Ghana's safest online marketplace."
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
              Sell Anything on Oysloe Marketplace
            </h1>

            <p className="text-gray-600 text-center mb-6">
              Ghana's trusted platform to sell cars, property, phones, appliances and more. Reach verified buyers instantly and get paid safely.
            </p>

            {/* Category Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
              {categories.map((category) => (
                <button
                  key={category.path}
                  onClick={() => navigate(category.path)}
                  className="p-6 border border-gray-200 rounded-lg hover:border-gray-400 hover:shadow-md transition text-left"
                >
                  <div className="text-4xl mb-3">{category.icon}</div>
                  <h3 className="text-xl font-semibold text-(--dark-def) mb-2">
                    {category.title}
                  </h3>
                  <p className="text-gray-600 text-sm">{category.description}</p>
                </button>
              ))}
            </div>

            <div className="bg-blue-50 border border-blue-200 rounded-lg p-6 mt-6">
              <h2 className="text-xl font-semibold text-(--dark-def) mb-2">
                💡 Getting Started
              </h2>
              <p className="text-gray-600">
                Simply choose a category above to learn more about selling your item.
                Each category has specific tips to help you create the perfect listing.
              </p>
            </div>

            <p className="text-gray-500 text-sm mt-6 mb-10">
              Can't find your item? Post an ad in any category that fits your needs.
            </p>
          </div>
        </div>
      </div>
    </>
  );
};

export default SellAnythingPage;
