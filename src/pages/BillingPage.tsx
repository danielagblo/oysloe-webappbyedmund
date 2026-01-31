import React from "react";
import { Helmet } from "react-helmet-async";
import { useNavigate } from "react-router-dom";

const BillingPage: React.FC = () => {
  const navigate = useNavigate();

  return (
    <>
      <Helmet>
        <title>Billing & Payments | OYSLOE Online Marketplace Ghana</title>
        <meta
          name="description"
          content="Manage your OYSLOE subscription billing and payments. View pricing plans, payment methods, invoices, and subscription details."
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
              💳 Billing & Payments
            </h1>

            <div className="text-left space-y-6">
              <section>
                <h2 className="text-2xl font-semibold text-(--dark-def) mb-3">
                  Subscription Pricing Plans
                </h2>
                <p className="text-gray-600 mb-4">
                  OYSLOE offers flexible subscription plans to help you sell more effectively. Choose the plan that best fits your needs.
                </p>

                {/* Pricing Plans Cards */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                  {/* Basic Plan */}
                  <div className="border border-gray-300 rounded-lg p-4 hover:shadow-md transition">
                    <div className="mb-3">
                      <h3 className="text-xl font-bold text-(--dark-def)">Basic <span className="text-lg font-semibold text-gray-600">1.50x</span></h3>
                      <p className="text-sm text-gray-600 mt-1">Best for small businesses</p>
                    </div>
                    <ul className="text-sm text-gray-600 space-y-1 mb-4 border-b pb-4">
                      <li className="flex items-start">
                        <span className="text-green-600 mr-2">✓</span>
                        <span>Share limited number of ads</span>
                      </li>
                      <li className="flex items-start">
                        <span className="text-green-600 mr-2">✓</span>
                        <span>Stays active for 7 days</span>
                      </li>
                    </ul>
                    <div className="mb-3">
                      <p className="text-2xl font-bold text-(--dark-def)">₵25.00</p>
                      <p className="text-sm text-gray-500 line-through">₵120.00</p>
                    </div>
                  </div>

                  {/* Business Plan */}
                  <div className="border-2 border-blue-500 rounded-lg p-4 shadow-md bg-blue-50 relative">
                    <div className="absolute -top-3 right-4 bg-blue-600 text-white px-3 py-1 rounded-full text-xs font-semibold">Popular</div>
                    <div className="mb-3">
                      <h3 className="text-xl font-bold text-(--dark-def)">Business <span className="text-lg font-semibold text-blue-600">4.00x</span></h3>
                      <p className="text-sm text-gray-600 mt-1">Best for SMEs</p>
                    </div>
                    <ul className="text-sm text-gray-600 space-y-1 mb-4 border-b pb-4">
                      <li className="flex items-start">
                        <span className="text-green-600 mr-2">✓</span>
                        <span>Pro partnership status</span>
                      </li>
                      <li className="flex items-start">
                        <span className="text-green-600 mr-2">✓</span>
                        <span>Earn more with best for SMEs</span>
                      </li>
                      <li className="flex items-start">
                        <span className="text-green-600 mr-2">✓</span>
                        <span>Active for 4 weeks</span>
                      </li>
                    </ul>
                    <div className="mb-3">
                      <p className="text-2xl font-bold text-blue-600">₵200.00</p>
                      <p className="text-sm text-gray-500 line-through">₵750.00</p>
                    </div>
                  </div>

                  {/* Platinum Plan */}
                  <div className="border border-purple-300 rounded-lg p-4 hover:shadow-md transition bg-gradient-to-br from-purple-50 to-blue-50 relative">
                    <div className="absolute -top-3 right-4 bg-purple-600 text-white px-2 py-1 rounded-full text-xs font-semibold">50% OFF</div>
                    <div className="mb-3">
                      <h3 className="text-xl font-bold text-(--dark-def)">Platinum <span className="text-lg font-semibold text-purple-600">10.00x</span></h3>
                      <p className="text-sm text-gray-600 mt-1">Best for large scale businesses</p>
                    </div>
                    <ul className="text-sm text-gray-600 space-y-1 mb-4 border-b pb-4">
                      <li className="flex items-start">
                        <span className="text-green-600 mr-2">✓</span>
                        <span>Submit unlimited ads and earn more</span>
                      </li>
                      <li className="flex items-start">
                        <span className="text-green-600 mr-2">✓</span>
                        <span>Stays active for 3 months</span>
                      </li>
                    </ul>
                    <div className="mb-3">
                      <p className="text-2xl font-bold text-purple-600">₵1,500.00</p>
                      <p className="text-sm text-gray-500 line-through">₵3,000.00</p>
                    </div>
                  </div>
                </div>

                <div className="space-y-3">
                  <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                    <p className="font-semibold text-gray-800 mb-2">📍 Plan Features Include:</p>
                    <ul className="list-disc list-inside text-gray-600 space-y-1">
                      <li>Increased visibility multiplier for your listings (1x to 3x+)</li>
                      <li>Featured listing placements</li>
                      <li>Enhanced ad exposure to buyers</li>
                      <li>Priority support</li>
                      <li>Monthly renewal options</li>
                      <li>Access to analytics and performance insights</li>
                    </ul>
                  </div>
                </div>

                <div className="bg-green-50 border border-green-200 rounded-lg p-4 mt-4">
                  <p className="font-semibold text-gray-800 mb-2">✨ What the Multiplier Means:</p>
                  <p className="text-gray-600 text-sm">
                    A listing multiplier increases the visibility of your products in search results. For example, a 2x multiplier shows your listings twice as often as basic listings, significantly increasing buyer engagement and sales potential.
                  </p>
                </div>
              </section>

              {/* Payment Methods */}
              <section>
                <h2 className="text-2xl font-semibold text-(--dark-def) mt-4 mb-3">
                  Payment Methods
                </h2>
                <p className="text-gray-600 mb-4">
                  We accept secure payments through the following methods:
                </p>
                <ul className="list-disc list-inside text-gray-600 space-y-2 ml-2">
                  <li>
                    <strong>Paystack:</strong> Ghana's leading online payment platform
                  </li>
                  <li>Mobile money (via Paystack integration)</li>
                  <li>Credit/Debit cards (Visa, Mastercard)</li>
                  <li>Bank transfers (USSD codes available)</li>
                  <li>All payments are secure and encrypted</li>
                </ul>
              </section>

              {/* How Billing Works */}
              <section>
                <h2 className="text-2xl font-semibold text-(--dark-def) mt-4 mb-3">
                  How Billing Works
                </h2>
                <div className="space-y-3">
                  <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
                    <p className="font-semibold text-gray-800 mb-2">1. Choose a Plan</p>
                    <p className="text-gray-600">Select from our available subscription tiers based on your selling goals.</p>
                  </div>
                  <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
                    <p className="font-semibold text-gray-800 mb-2">2. Secure Payment</p>
                    <p className="text-gray-600">Complete payment through Paystack or your preferred payment method.</p>
                  </div>
                  <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
                    <p className="font-semibold text-gray-800 mb-2">3. Instant Activation</p>
                    <p className="text-gray-600">Your subscription activates immediately after successful payment.</p>
                  </div>
                  <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
                    <p className="font-semibold text-gray-800 mb-2">4. Enjoy Benefits</p>
                    <p className="text-gray-600">Your listings gain the multiplier boost and enhanced visibility right away.</p>
                  </div>
                </div>
              </section>

              {/* Subscription Management */}
              <section>
                <h2 className="text-2xl font-semibold text-(--dark-def) mt-4 mb-3">
                  Manage Your Subscription
                </h2>
                <ul className="list-disc list-inside text-gray-600 space-y-2 ml-2">
                  <li>View your active subscription in your profile dashboard</li>
                  <li>Check subscription expiration dates</li>
                  <li>Renew before expiration to maintain benefits</li>
                  <li>Upgrade to a higher tier anytime</li>
                  <li>Cancel anytime (no long-term commitment)</li>
                </ul>
              </section>

              {/* Pricing & Discounts */}
              <section>
                <h2 className="text-2xl font-semibold text-(--dark-def) mt-4 mb-3">
                  Pricing & Special Offers
                </h2>
                <ul className="list-disc list-inside text-gray-600 space-y-2 ml-2">
                  <li>Monthly subscription plans with flexible billing</li>
                  <li>Special discounts for first-time subscribers</li>
                  <li>Loyalty rewards for recurring subscriptions</li>
                  <li>Promotional offers during sales seasons</li>
                  <li>Check your profile for personalized offers</li>
                </ul>
              </section>

              {/* Receipts & Invoices */}
              <section>
                <h2 className="text-2xl font-semibold text-(--dark-def) mt-4 mb-3">
                  Receipts & Invoices
                </h2>
                <ul className="list-disc list-inside text-gray-600 space-y-2 ml-2">
                  <li>Digital receipts sent to your email immediately after payment</li>
                  <li>View payment history in your profile</li>
                  <li>Download invoices for accounting purposes</li>
                  <li>Detailed transaction information available</li>
                </ul>
              </section>

              {/* Billing FAQs */}
              <section>
                <h2 className="text-2xl font-semibold text-(--dark-def) mt-4 mb-3">
                  Billing Questions?
                </h2>
                <div className="space-y-3">
                  <details className="border border-gray-200 rounded-lg p-3">
                    <summary className="font-semibold text-(--dark-def) cursor-pointer">
                      Can I change my subscription plan anytime?
                    </summary>
                    <p className="text-gray-600 mt-2">
                      Yes! You can upgrade to a higher tier anytime. If downgrading, the change takes effect at your next renewal.
                    </p>
                  </details>

                  <details className="border border-gray-200 rounded-lg p-3">
                    <summary className="font-semibold text-(--dark-def) cursor-pointer">
                      What happens if my subscription expires?
                    </summary>
                    <p className="text-gray-600 mt-2">
                      Your listings will continue to appear on Oysloe but will lose the visibility multiplier boost. Renew your subscription to regain premium benefits.
                    </p>
                  </details>

                  <details className="border border-gray-200 rounded-lg p-3">
                    <summary className="font-semibold text-(--dark-def) cursor-pointer">
                      Is my payment information secure?
                    </summary>
                    <p className="text-gray-600 mt-2">
                      Absolutely! We use Paystack, a PCI-compliant payment processor. Your payment details are encrypted and secure.
                    </p>
                  </details>

                  <details className="border border-gray-200 rounded-lg p-3">
                    <summary className="font-semibold text-(--dark-def) cursor-pointer">
                      Can I get a refund?
                    </summary>
                    <p className="text-gray-600 mt-2">
                      Refunds are handled on a case-by-case basis. Contact our support team within 7 days of payment for assistance.
                    </p>
                  </details>

                  <details className="border border-gray-200 rounded-lg p-3">
                    <summary className="font-semibold text-(--dark-def) cursor-pointer">
                      What payment methods are accepted?
                    </summary>
                    <p className="text-gray-600 mt-2">
                      We accept credit/debit cards (Visa, Mastercard), mobile money, bank transfers, and USSD payments through Paystack.
                    </p>
                  </details>
                </div>
              </section>

              {/* Contact for Billing Issues */}
              <section className="bg-green-50 border border-green-200 rounded-lg p-4">
                <h2 className="text-xl font-semibold text-(--dark-def) mb-3">
                  Need Help with Billing?
                </h2>
                <p className="text-gray-600 mb-3">
                  Contact our support team for any billing inquiries or issues:
                </p>
                <div className="space-y-2">
                  <p className="text-gray-600">
                    <strong>Email:</strong> <a href="mailto:agblod27@gmail.com" className="text-(--dark-def) hover:underline">agblod27@gmail.com</a>
                  </p>
                  <p className="text-gray-600">
                    <strong>Phone:</strong> <a href="tel:+233552892433" className="text-(--dark-def) hover:underline">+233552892433</a>
                  </p>
                  <p className="text-gray-600 text-sm mt-3">
                    We're here to help! Response time: Within 24 hours
                  </p>
                </div>
              </section>

              <p className="text-gray-500 text-sm mt-6 mb-10">
                For complete subscription management, visit your profile dashboard where you can view active subscriptions, renewal dates, and payment history.
              </p>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default BillingPage;
