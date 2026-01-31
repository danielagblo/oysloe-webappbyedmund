import React from "react";
import { Helmet } from "react-helmet-async";
import { useNavigate } from "react-router-dom";

const TermsPage: React.FC = () => {
  const navigate = useNavigate();

  return (
    <>
      <Helmet>
        <title>Terms & Conditions | OYSLOE Online Marketplace Ghana</title>
        <meta
          name="description"
          content="OYSLOE Terms & Conditions - Understand the rules and regulations governing your use of our online marketplace platform."
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
            <h1 className="text-3xl sm:text-4xl font-bold text-(--dark-def) max-lg:pt-15 mb-2">
              📋 Terms & Conditions
            </h1>

            <div className="text-left space-y-4 text-sm sm:text-base leading-relaxed">
              <p className="text-gray-600">
                <strong>Effective Date: 21/1/2026</strong>
              </p>

              <p className="text-gray-600">
                Welcome to OYSLOE ("Platform"). These Terms and Conditions ("Terms") govern your access to and use of the OYSLOE website, mobile application, and related services. By accessing or using OYSLOE, you agree to be bound by these Terms.
              </p>

              {/* Section 1 */}
              <section>
                <h2 className="text-xl font-semibold text-(--dark-def) mt-4 mb-2">
                  1. About OYSLOE
                </h2>
                <p className="text-gray-600">
                  OYSLOE is an online marketplace that connects buyers and sellers. OYSLOE provides a platform for users to list, discover, and communicate about products and services. OYSLOE is not a party to transactions between buyers and sellers.
                </p>
              </section>

              {/* Section 2 */}
              <section>
                <h2 className="text-xl font-semibold text-(--dark-def) mt-4 mb-2">
                  2. Eligibility
                </h2>
                <p className="text-gray-600">
                  To use OYSLOE, you must:
                </p>
                <ul className="list-disc list-inside text-gray-600 space-y-1 ml-2">
                  <li>Be at least 16 years old</li>
                  <li>Provide accurate and complete information during registration</li>
                  <li>Have the legal capacity to enter into binding agreements</li>
                </ul>
              </section>

              {/* Section 3 */}
              <section>
                <h2 className="text-xl font-semibold text-(--dark-def) mt-4 mb-2">
                  3. Account Registration
                </h2>
                <ul className="list-disc list-inside text-gray-600 space-y-1 ml-2">
                  <li>Users are responsible for maintaining the confidentiality of their account credentials</li>
                  <li>All information provided must be accurate and up to date</li>
                  <li>OYSLOE reserves the right to suspend or terminate accounts that provide false or misleading information</li>
                </ul>
              </section>

              {/* Section 4 */}
              <section>
                <h2 className="text-xl font-semibold text-(--dark-def) mt-4 mb-2">
                  4. Seller Obligations
                </h2>
                <p className="text-gray-600">
                  Sellers agree to:
                </p>
                <ul className="list-disc list-inside text-gray-600 space-y-1 ml-2">
                  <li>Provide accurate and truthful listings</li>
                  <li>Comply with all applicable laws and regulations</li>
                  <li>Deliver products or services as described</li>
                  <li>Resolve buyer complaints in good faith</li>
                </ul>
                <p className="text-gray-600 mt-2">
                  OYSLOE reserves the right to remove listings or restrict sellers that violate platform policies.
                </p>
              </section>

              {/* Section 5 */}
              <section>
                <h2 className="text-xl font-semibold text-(--dark-def) mt-4 mb-2">
                  5. Buyer Responsibilities
                </h2>
                <p className="text-gray-600">
                  Buyers agree to:
                </p>
                <ul className="list-disc list-inside text-gray-600 space-y-1 ml-2">
                  <li>Review listings carefully before engaging sellers</li>
                  <li>Communicate respectfully with sellers</li>
                  <li>Make payments directly to sellers where applicable</li>
                </ul>
              </section>

              {/* Section 6 */}
              <section>
                <h2 className="text-xl font-semibold text-(--dark-def) mt-4 mb-2">
                  6. Payments and Fees
                </h2>
                <ul className="list-disc list-inside text-gray-600 space-y-1 ml-2">
                  <li>OYSLOE does not process payments for goods or services sold on the Platform</li>
                  <li>Payments for products or services are made directly between buyers and sellers</li>
                  <li>Any fees paid to OYSLOE are subscription or platform usage fees for access to marketplace features</li>
                </ul>
              </section>

              {/* Section 7 */}
              <section>
                <h2 className="text-xl font-semibold text-(--dark-def) mt-4 mb-2">
                  7. Prohibited Activities
                </h2>
                <p className="text-gray-600">
                  Users must not:
                </p>
                <ul className="list-disc list-inside text-gray-600 space-y-1 ml-2">
                  <li>List illegal, restricted, or prohibited items</li>
                  <li>Engage in fraudulent, deceptive, or misleading activities</li>
                  <li>Violate intellectual property rights</li>
                  <li>Abuse, harass, or harm other users</li>
                  <li>Attempt to bypass platform safeguards</li>
                </ul>
              </section>

              {/* Section 8 */}
              <section>
                <h2 className="text-xl font-semibold text-(--dark-def) mt-4 mb-2">
                  8. Acceptable Use
                </h2>
                <p className="text-gray-600">
                  Users must comply with OYSLOE's Acceptable Use Policy, which forms part of these Terms.
                </p>
              </section>

              {/* Section 9 */}
              <section>
                <h2 className="text-xl font-semibold text-(--dark-def) mt-4 mb-2">
                  9. Dispute Resolution
                </h2>
                <ul className="list-disc list-inside text-gray-600 space-y-1 ml-2">
                  <li>Disputes between buyers and sellers should first be resolved between the parties</li>
                  <li>OYSLOE may provide guidance but does not guarantee dispute outcomes</li>
                  <li>OYSLOE is not liable for losses arising from user transactions</li>
                </ul>
              </section>

              {/* Section 10 */}
              <section>
                <h2 className="text-xl font-semibold text-(--dark-def) mt-4 mb-2">
                  10. Limitation of Liability
                </h2>
                <p className="text-gray-600">
                  To the maximum extent permitted by law, OYSLOE shall not be liable for:
                </p>
                <ul className="list-disc list-inside text-gray-600 space-y-1 ml-2">
                  <li>Losses arising from user transactions</li>
                  <li>Misrepresentation by users</li>
                  <li>Delays, failures, or disruptions beyond our control</li>
                </ul>
              </section>

              {/* Section 11 */}
              <section>
                <h2 className="text-xl font-semibold text-(--dark-def) mt-4 mb-2">
                  11. Termination
                </h2>
                <p className="text-gray-600">
                  OYSLOE reserves the right to suspend or terminate user accounts for violations of these Terms, applicable laws, or platform policies.
                </p>
              </section>

              {/* Section 12 */}
              <section>
                <h2 className="text-xl font-semibold text-(--dark-def) mt-4 mb-2">
                  12. Intellectual Property
                </h2>
                <p className="text-gray-600">
                  All content, trademarks, and materials on the Platform are the property of OYSLOE or its licensors and may not be used without permission.
                </p>
              </section>

              {/* Section 13 */}
              <section>
                <h2 className="text-xl font-semibold text-(--dark-def) mt-4 mb-2">
                  13. Changes to These Terms
                </h2>
                <p className="text-gray-600">
                  OYSLOE may update these Terms from time to time. Continued use of the Platform constitutes acceptance of the updated Terms.
                </p>
              </section>

              {/* Section 14 */}
              <section>
                <h2 className="text-xl font-semibold text-(--dark-def) mt-4 mb-2">
                  14. Governing Law
                </h2>
                <p className="text-gray-600">
                  These Terms shall be governed by and construed in accordance with the laws applicable in the jurisdiction where OYSLOE operates.
                </p>
              </section>

              {/* Section 15 */}
              <section>
                <h2 className="text-xl font-semibold text-(--dark-def) mt-4 mb-2">
                  15. Contact Information
                </h2>
                <p className="text-gray-600">
                  If you have questions about these Terms, please contact us:
                </p>
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mt-3 space-y-2">
                  <p className="text-gray-700">
                    <strong>OYSLOE</strong>
                  </p>
                  <p className="text-gray-600">
                    <strong>Email:</strong> <a href="mailto:agblod27@gmail.com" className="text-(--dark-def) hover:underline">agblod27@gmail.com</a>
                  </p>
                  <p className="text-gray-600">
                    <strong>Phone:</strong> <a href="tel:+233552892433" className="text-(--dark-def) hover:underline">+233552892433</a>
                  </p>
                </div>
              </section>

              {/* Section 16 */}
              <section>
                <h2 className="text-xl font-semibold text-(--dark-def) mt-4 mb-2">
                  16. Age Acknowledgment
                </h2>
                <p className="text-gray-600">
                  By using OYSLOE, you confirm that you are at least 16 years old and legally capable of entering into these Terms and Conditions.
                </p>
              </section>

              {/* Final Acknowledgment */}
              <section className="bg-green-50 border border-green-200 rounded-lg p-4 mt-4">
                <p className="text-gray-700">
                  By using OYSLOE, you confirm that you have read, understood, and agreed to these Terms and Conditions.
                </p>
              </section>

              <p className="text-gray-500 text-sm mt-6 mb-10">
                Last updated: 21 January 2026
              </p>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default TermsPage;
