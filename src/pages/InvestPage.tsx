import React from "react";
import { Helmet } from "react-helmet-async";
import { useNavigate } from "react-router-dom";

const InvestPage: React.FC = () => {
  const navigate = useNavigate();

  return (
    <>
      <Helmet>
        <title>Invest in Oysloe | E-commerce Investment Opportunity Ghana</title>
        <meta
          name="description"
          content="Investment opportunity in Oysloe, Ghana's leading online marketplace. Join us in revolutionizing e-commerce in Africa. Contact us for partnership and investment details."
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
              💼 Invest in Oysloe
            </h1>

            <div className="text-left space-y-6">
              {/* About Investment */}
              <section>
                <h2 className="text-2xl font-semibold text-(--dark-def) mb-3">
                  Investment Opportunity
                </h2>
                <p className="text-gray-600">
                  Oysloe is Ghana's fastest-growing online marketplace, connecting thousands of buyers and sellers. We're seeking strategic investors to help us expand and revolutionize e-commerce across Africa.
                </p>
              </section>

              {/* Why Invest in Oysloe */}
              <section>
                <h2 className="text-2xl font-semibold text-(--dark-def) mb-3">
                  Why Invest in Oysloe?
                </h2>
                <ul className="list-disc list-inside text-gray-600 space-y-2 ml-2">
                  <li>Growing e-commerce market in Ghana and West Africa</li>
                  <li>Proven business model with steady user growth</li>
                  <li>Strong team with e-commerce expertise</li>
                  <li>Multiple revenue streams (listings, premium features, partnerships)</li>
                  <li>First-mover advantage in the Ghanaian marketplace space</li>
                  <li>Scalable platform technology</li>
                  <li>Large addressable market with high growth potential</li>
                </ul>
              </section>

              {/* Market Opportunity */}
              <section>
                <h2 className="text-2xl font-semibold text-(--dark-def) mb-3">
                  Market Opportunity
                </h2>
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 space-y-3">
                  <p className="text-gray-600">
                    <strong>Ghana's E-commerce Market:</strong> Growing at 25% annually, with increasing smartphone penetration and digital payment adoption.
                  </p>
                  <p className="text-gray-600">
                    <strong>User Base:</strong> Thousands of active buyers and sellers, with strong engagement metrics.
                  </p>
                  <p className="text-gray-600">
                    <strong>Regional Expansion:</strong> Plans to expand to neighboring West African countries.
                  </p>
                </div>
              </section>

              {/* Investment Details */}
              <section>
                <h2 className="text-2xl font-semibold text-(--dark-def) mb-3">
                  Investment Details
                </h2>
                <ul className="list-disc list-inside text-gray-600 space-y-2 ml-2">
                  <li>Seed and Series A funding available</li>
                  <li>Flexible investment terms and structures</li>
                  <li>Board representation opportunities</li>
                  <li>Clear exit strategy and growth timeline</li>
                  <li>Detailed financial projections available</li>
                </ul>
              </section>

              {/* Use of Funds */}
              <section>
                <h2 className="text-2xl font-semibold text-(--dark-def) mb-3">
                  Use of Funds
                </h2>
                <div className="space-y-2">
                  <div className="flex justify-between items-center p-3 bg-gray-50 rounded">
                    <span className="text-gray-700">Platform Development</span>
                    <span className="font-semibold text-gray-800">35%</span>
                  </div>
                  <div className="flex justify-between items-center p-3 bg-gray-50 rounded">
                    <span className="text-gray-700">Marketing & User Acquisition</span>
                    <span className="font-semibold text-gray-800">40%</span>
                  </div>
                  <div className="flex justify-between items-center p-3 bg-gray-50 rounded">
                    <span className="text-gray-700">Team Expansion</span>
                    <span className="font-semibold text-gray-800">15%</span>
                  </div>
                  <div className="flex justify-between items-center p-3 bg-gray-50 rounded">
                    <span className="text-gray-700">Operations & Infrastructure</span>
                    <span className="font-semibold text-gray-800">10%</span>
                  </div>
                </div>
              </section>

              {/* Contact Section */}
              <section className="bg-green-50 border border-green-200 rounded-lg p-6">
                <h2 className="text-2xl font-semibold text-(--dark-def) mb-4">
                  Get in Touch
                </h2>
                <p className="text-gray-600 mb-4">
                  Interested in investing or partnering with Oysloe? Contact us today!
                </p>
                <div className="space-y-3">
                  <div className="flex items-center gap-3">
                    <span className="text-2xl">📞</span>
                    <div>
                      <p className="text-gray-700 font-medium">Phone</p>
                      <a
                        href="tel:+233552892433"
                        className="text-(--dark-def) hover:underline font-semibold"
                      >
                        +233 552 892 433
                      </a>
                      <span className="text-gray-600"> / </span>
                      <a
                        href="tel:+233538273363"
                        className="text-(--dark-def) hover:underline font-semibold"
                      >
                        +233 538 273 363
                      </a>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="text-2xl">✉️</span>
                    <div>
                      <p className="text-gray-700 font-medium">Email</p>
                      <a
                        href="mailto:AGBLOD27@GMAIL.COM"
                        className="text-(--dark-def) hover:underline font-semibold"
                      >
                        AGBLOD27@GMAIL.COM
                      </a>
                    </div>
                  </div>
                </div>
              </section>

              {/* FAQ */}
              <section>
                <h2 className="text-2xl font-semibold text-(--dark-def) mb-3">
                  Investment FAQ
                </h2>
                <div className="space-y-3">
                  <details className="border border-gray-200 rounded-lg p-3">
                    <summary className="font-semibold text-(--dark-def) cursor-pointer">
                      What is the minimum investment amount?
                    </summary>
                    <p className="text-gray-600 mt-2">
                      Minimum investment varies based on funding round. Please contact us for specific details.
                    </p>
                  </details>

                  <details className="border border-gray-200 rounded-lg p-3">
                    <summary className="font-semibold text-(--dark-def) cursor-pointer">
                      What equity stake will I receive?
                    </summary>
                    <p className="text-gray-600 mt-2">
                      Equity stakes are negotiated based on investment amount and terms. We offer competitive valuations.
                    </p>
                  </details>

                  <details className="border border-gray-200 rounded-lg p-3">
                    <summary className="font-semibold text-(--dark-def) cursor-pointer">
                      When is the expected ROI timeline?
                    </summary>
                    <p className="text-gray-600 mt-2">
                      We project profitability within 2-3 years with potential exit opportunities within 5-7 years.
                    </p>
                  </details>

                  <details className="border border-gray-200 rounded-lg p-3">
                    <summary className="font-semibold text-(--dark-def) cursor-pointer">
                      Do you have existing investors?
                    </summary>
                    <p className="text-gray-600 mt-2">
                      Yes, we have strategic investors and advisors. Please contact us for investor references.
                    </p>
                  </details>
                </div>
              </section>

              <p className="text-gray-500 text-sm mt-6 mb-10">
                All investment inquiries are confidential and reviewed promptly.
              </p>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default InvestPage;
