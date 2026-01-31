import React from "react";
import { Helmet } from "react-helmet-async";
import { useNavigate } from "react-router-dom";

const AboutPage: React.FC = () => {
  const navigate = useNavigate();

  return (
    <>
      <Helmet>
        <title>About Oysloe | Ghana's Leading E-commerce Marketplace</title>
        <meta
          name="description"
          content="Learn about Oysloe - Ghana's fastest-growing online marketplace connecting buyers and sellers. Discover our mission, vision, values, and impact on African e-commerce."
        />
        <meta
          name="keywords"
          content="about Oysloe, e-commerce Ghana, marketplace, mission, vision, African commerce"
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
              About Oysloe
            </h1>
            <p className="text-gray-600 mb-4">
              Revolutionizing E-Commerce in Africa - One Transaction at a Time
            </p>

            <div className="text-left space-y-6">
              {/* Our Story */}
              <section>
                <h2 className="text-2xl font-semibold text-(--dark-def) mb-3">
                  Our Story
                </h2>
                <p className="text-gray-600">
                  Oysloe was founded with a simple yet powerful vision: to transform e-commerce in Ghana and across Africa. 
                  We recognized that while digital commerce was growing globally, African entrepreneurs and consumers faced barriers 
                  to accessing reliable, user-friendly online marketplaces. Founded in 2024, Oysloe emerged from this need to create 
                  a platform where anyone - whether a small business owner or individual seller - could reach thousands of potential 
                  customers with ease.
                </p>
              </section>

              {/* Our Mission */}
              <section>
                <h2 className="text-2xl font-semibold text-(--dark-def) mb-3">
                  Our Mission
                </h2>
                <div className="border-l-4 p-4 rounded" style={{backgroundColor: 'rgba(116, 255, 167, 0.1)', borderColor: '#74ffa7'}}>
                  <p className="text-gray-700 font-medium">
                    To empower African entrepreneurs and consumers by providing a secure, accessible, and innovative online 
                    marketplace that enables seamless buying and selling of goods and services across the continent.
                  </p>
                </div>
              </section>

              {/* Our Vision */}
              <section>
                <h2 className="text-2xl font-semibold text-(--dark-def) mb-3">
                  Our Vision
                </h2>
                <div className="bg-green-50 border-l-4 border-green-500 p-4 rounded">
                  <p className="text-gray-700 font-medium">
                    To become the most trusted and innovative e-commerce platform in Africa, fostering economic growth, 
                    creating opportunities, and connecting millions of buyers and sellers across borders.
                  </p>
                </div>
              </section>

              {/* Our Values */}
              <section>
                <h2 className="text-2xl font-semibold text-(--dark-def) mb-3">
                  Our Core Values
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition">
                    <h3 className="font-semibold text-(--dark-def) mb-2">🤝 Trust & Transparency</h3>
                    <p className="text-gray-600 text-sm">
                      We build trust through honest practices, secure transactions, and clear communication with all stakeholders.
                    </p>
                  </div>
                  <div className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition">
                    <h3 className="font-semibold text-(--dark-def) mb-2">💡 Innovation</h3>
                    <p className="text-gray-600 text-sm">
                      We continuously innovate to improve user experience and adapt to the evolving needs of African e-commerce.
                    </p>
                  </div>
                  <div className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition">
                    <h3 className="font-semibold text-(--dark-def) mb-2">🌍 Inclusivity</h3>
                    <p className="text-gray-600 text-sm">
                      We're committed to creating equal opportunities for all, regardless of size, background, or location.
                    </p>
                  </div>
                  <div className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition">
                    <h3 className="font-semibold text-(--dark-def) mb-2">⚡ Excellence</h3>
                    <p className="text-gray-600 text-sm">
                      We strive for excellence in every aspect - from product quality to customer service to platform reliability.
                    </p>
                  </div>
                  <div className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition">
                    <h3 className="font-semibold text-(--dark-def) mb-2">🔒 Security & Safety</h3>
                    <p className="text-gray-600 text-sm">
                      Protecting our users' data and ensuring safe transactions is paramount to everything we do.
                    </p>
                  </div>
                  <div className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition">
                    <h3 className="font-semibold text-(--dark-def) mb-2">📈 Growth & Sustainability</h3>
                    <p className="text-gray-600 text-sm">
                      We're dedicated to sustainable growth that benefits sellers, buyers, and our broader communities.
                    </p>
                  </div>
                </div>
              </section>

              {/* What We Offer */}
              <section>
                <h2 className="text-2xl font-semibold text-(--dark-def) mb-3">
                  What We Offer
                </h2>
                <ul className="list-disc list-inside text-gray-600 space-y-2 ml-2">
                  <li><strong>Easy Selling Platform:</strong> Simple tools for anyone to list and sell products online</li>
                  <li><strong>Wide Product Categories:</strong> From cars and property to electronics, fashion, and more</li>
                  <li><strong>Secure Payment Processing:</strong> Multiple payment options including Paystack, mobile money, and bank transfers</li>
                  <li><strong>Buyer Protection:</strong> Robust systems to ensure safe and reliable transactions</li>
                  <li><strong>Seller Growth Tools:</strong> Subscription plans to boost visibility and reach more customers</li>
                  <li><strong>Live Chat Support:</strong> Real-time assistance for all your marketplace needs</li>
                  <li><strong>Product Analytics:</strong> Insights to help sellers understand market trends and optimize listings</li>
                  <li><strong>Community Features:</strong> Ratings, reviews, and ratings to build trust and accountability</li>
                </ul>
              </section>

              {/* Why Choose Oysloe */}
              <section>
                <h2 className="text-2xl font-semibold text-(--dark-def) mb-3">
                  Why Choose Oysloe?
                </h2>
                <div className="space-y-3">
                  <div className="flex gap-3">
                    <span className="text-green-600 font-bold text-xl">✓</span>
                    <div>
                      <h4 className="font-semibold text-(--dark-def) mb-1">Trusted by Thousands</h4>
                      <p className="text-gray-600 text-sm">Join a growing community of Ghanaian entrepreneurs and consumers</p>
                    </div>
                  </div>
                  <div className="flex gap-3">
                    <span className="text-green-600 font-bold text-xl">✓</span>
                    <div>
                      <h4 className="font-semibold text-(--dark-def) mb-1">Local Expert Support</h4>
                      <p className="text-gray-600 text-sm">Our team understands the African market and speaks your language</p>
                    </div>
                  </div>
                  <div className="flex gap-3">
                    <span className="text-green-600 font-bold text-xl">✓</span>
                    <div>
                      <h4 className="font-semibold text-(--dark-def) mb-1">Affordable & Transparent</h4>
                      <p className="text-gray-600 text-sm">No hidden fees - clear pricing and flexible subscription options</p>
                    </div>
                  </div>
                  <div className="flex gap-3">
                    <span className="text-green-600 font-bold text-xl">✓</span>
                    <div>
                      <h4 className="font-semibold text-(--dark-def) mb-1">Continuous Improvement</h4>
                      <p className="text-gray-600 text-sm">We constantly upgrade based on user feedback and market needs</p>
                    </div>
                  </div>
                  <div className="flex gap-3">
                    <span className="text-green-600 font-bold text-xl">✓</span>
                    <div>
                      <h4 className="font-semibold text-(--dark-def) mb-1">Mobile-First Design</h4>
                      <p className="text-gray-600 text-sm">Optimized for smartphones - browse and sell on the go</p>
                    </div>
                  </div>
                </div>
              </section>

              {/* Our Impact */}
              <section className="bg-purple-50 p-4 rounded-lg border border-purple-200">
                <h2 className="text-2xl font-semibold text-(--dark-def) mb-3">
                  Our Impact
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                  <div className="text-center">
                    <p className="text-3xl font-bold text-purple-600">10,000+</p>
                    <p className="text-gray-600 text-sm">Active Sellers</p>
                  </div>
                  <div className="text-center">
                    <p className="text-3xl font-bold text-purple-600">50,000+</p>
                    <p className="text-gray-600 text-sm">Monthly Users</p>
                  </div>
                  <div className="text-center">
                    <p className="text-3xl font-bold text-purple-600">100,000+</p>
                    <p className="text-gray-600 text-sm">Products Listed</p>
                  </div>
                </div>
                <p className="text-gray-700 text-sm">
                  Since launch, Oysloe has facilitated thousands of successful transactions, helped small business owners 
                  reach new markets, and generated employment across Ghana. We're proud to be part of the digital transformation 
                  of African e-commerce.
                </p>
              </section>

              {/* Get Involved */}
              <section>
                <h2 className="text-2xl font-semibold text-(--dark-def) mb-3">
                  Join Our Community
                </h2>
                <p className="text-gray-600 mb-4">
                  Whether you're a buyer looking for quality products or a seller wanting to grow your business, 
                  Oysloe welcomes you to be part of our journey.
                </p>
                <div className="space-y-2">
                  <a
                    href="/sell"
                    className="inline-block bg-(--green) text-(--dark-def) px-6 py-2 rounded-lg font-semibold hover:opacity-90 transition mr-2 mb-2"
                  >
                    Start Selling
                  </a>
                  <a
                    href="/"
                    className="inline-block border border-gray-300 text-(--dark-def) px-6 py-2 rounded-lg font-semibold hover:bg-gray-50 transition"
                  >
                    Browse Products
                  </a>
                </div>
              </section>

              {/* Contact */}
              <section className="bg-gray-50 p-4 rounded-lg">
                <h2 className="text-xl font-semibold text-(--dark-def) mb-3">
                  Get in Touch
                </h2>
                <div className="space-y-2 text-sm">
                  <p className="text-gray-600">
                    <strong>Email:</strong> <a href="mailto:agblod27@gmail.com" className="text-green-600 hover:underline">agblod27@gmail.com</a>
                  </p>
                  <p className="text-gray-600">
                    <strong>Phone:</strong> <a href="tel:+233552892433" className="text-green-600 hover:underline">+233 55 289 2433</a> / 
                    <a href="tel:+233538273363" className="text-green-600 hover:underline"> +233 53 827 3363</a>
                  </p>
                  <p className="text-gray-600">
                    <strong>Location:</strong> Accra, Ghana
                  </p>
                  <p className="text-gray-600">
                    <strong>Website:</strong> <a href="https://oysloe.com" className="text-green-600 hover:underline">oysloe.com</a>
                  </p>
                </div>
              </section>

              <p className="text-gray-500 text-sm mt-6 mb-10">
                Last updated: {new Date().toLocaleDateString()}
              </p>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default AboutPage;
