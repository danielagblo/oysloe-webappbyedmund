import React from "react";
import { Helmet } from "react-helmet-async";
import { useNavigate } from "react-router-dom";

const PrivacyPage: React.FC = () => {
  const navigate = useNavigate();

  return (
    <>
      <Helmet>
        <title>Privacy Policy | OYSLOE Online Marketplace Ghana</title>
        <meta
          name="description"
          content="OYSLOE Privacy Policy - Learn how we collect, use, and protect your personal information on our online marketplace."
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
              🔒 Privacy Policy
            </h1>

            <div className="text-left space-y-4 text-sm sm:text-base leading-relaxed">
              <p className="text-gray-600">
                <strong>Effective Date: 21/01/2026</strong>
              </p>

              <p className="text-gray-600">
                OYSLOE ("we", "our", "us") is an online marketplace. We are committed to protecting your privacy and ensuring that your personal information is handled in a safe, transparent, and responsible manner.
              </p>

              <p className="text-gray-600">
                This Privacy Policy explains how we collect, use, disclose, and protect your information when you use the OYSLOE website, mobile application, and related services (collectively, the "Platform").
              </p>

              {/* Section 1 */}
              <section>
                <h2 className="text-xl font-semibold text-(--dark-def) mt-4 mb-2">
                  1. Information We Collect
                </h2>
                
                <h3 className="font-semibold text-(--dark-def) mt-3 mb-2">
                  a. Information You Provide to Us
                </h3>
                <p className="text-gray-600">
                  When you create an account or use the Platform, we may collect:
                </p>
                <ul className="list-disc list-inside text-gray-600 space-y-1 ml-2">
                  <li>Full legal name or business name</li>
                  <li>Phone number and email address</li>
                  <li>Residential or business address / location</li>
                  <li>Government-issued ID details (e.g., Ghana Card, Passport, Driver's License) for verification purposes</li>
                  <li>Profile photo (where applicable)</li>
                  <li>Login credentials</li>
                  <li>Any information you submit when contacting support</li>
                </ul>

                <h3 className="font-semibold text-(--dark-def) mt-3 mb-2">
                  b. Transactional & Usage Information
                </h3>
                <ul className="list-disc list-inside text-gray-600 space-y-1 ml-2">
                  <li>Listings created, viewed, or interacted with</li>
                  <li>Messages and communications within the Platform</li>
                  <li>Subscription or platform usage details</li>
                  <li>Log data such as IP address, device type, browser type, and access times</li>
                </ul>

                <h3 className="font-semibold text-(--dark-def) mt-3 mb-2">
                  c. Automatically Collected Information
                </h3>
                <ul className="list-disc list-inside text-gray-600 space-y-1 ml-2">
                  <li>Device and usage information</li>
                  <li>Cookies and similar tracking technologies to improve functionality and user experience</li>
                </ul>
              </section>

              {/* Section 2 */}
              <section>
                <h2 className="text-xl font-semibold text-(--dark-def) mt-4 mb-2">
                  2. How We Use Your Information
                </h2>
                <p className="text-gray-600">
                  We use your information to:
                </p>
                <ul className="list-disc list-inside text-gray-600 space-y-1 ml-2">
                  <li>Create and manage user accounts</li>
                  <li>Verify identities and conduct KYC checks</li>
                  <li>Enable users to list, discover, and communicate about products and services</li>
                  <li>Improve platform performance and user experience</li>
                  <li>Communicate important updates, notifications, and support messages</li>
                  <li>Prevent fraud, abuse, and unauthorized activities</li>
                  <li>Comply with legal and regulatory requirements</li>
                </ul>
              </section>

              {/* Section 3 */}
              <section>
                <h2 className="text-xl font-semibold text-(--dark-def) mt-4 mb-2">
                  3. Payments
                </h2>
                <p className="text-gray-600">
                  OYSLOE does not process payments for goods or services sold on the Platform. Any payments made to OYSLOE are subscription or platform usage fees paid by vendors for access to marketplace features. All product or service payments are handled directly between buyers and sellers.
                </p>
              </section>

              {/* Section 4 */}
              <section>
                <h2 className="text-xl font-semibold text-(--dark-def) mt-4 mb-2">
                  4. Sharing of Information
                </h2>
                <p className="text-gray-600">
                  We do not sell or rent your personal information. We may share information only:
                </p>
                <ul className="list-disc list-inside text-gray-600 space-y-1 ml-2">
                  <li>With service providers who assist in operating the Platform (under confidentiality obligations)</li>
                  <li>When required by law, regulation, or legal process</li>
                  <li>To protect the rights, safety, and integrity of OYSLOE, its users, or the public</li>
                </ul>
              </section>

              {/* Section 5 */}
              <section>
                <h2 className="text-xl font-semibold text-(--dark-def) mt-4 mb-2">
                  5. Data Security
                </h2>
                <p className="text-gray-600">
                  We implement appropriate technical and organizational measures to protect personal information against unauthorized access, loss, misuse, or alteration. However, no system is completely secure, and users are encouraged to protect their login credentials.
                </p>
              </section>

              {/* Section 6 */}
              <section>
                <h2 className="text-xl font-semibold text-(--dark-def) mt-4 mb-2">
                  6. Data Retention
                </h2>
                <p className="text-gray-600">
                  We retain personal information only for as long as necessary to fulfill the purposes outlined in this Policy, comply with legal obligations, resolve disputes, and enforce our agreements.
                </p>
              </section>

              {/* Section 7 */}
              <section>
                <h2 className="text-xl font-semibold text-(--dark-def) mt-4 mb-2">
                  7. Your Rights
                </h2>
                <p className="text-gray-600">
                  Depending on applicable laws, you may have the right to:
                </p>
                <ul className="list-disc list-inside text-gray-600 space-y-1 ml-2">
                  <li>Access and review your personal information</li>
                  <li>Correct or update inaccurate data</li>
                  <li>Request deletion of your account or personal data (subject to legal requirements)</li>
                  <li>Withdraw consent where applicable</li>
                </ul>
                <p className="text-gray-600 mt-2">
                  Requests can be made through our support channels.
                </p>
              </section>

              {/* Section 8 */}
              <section>
                <h2 className="text-xl font-semibold text-(--dark-def) mt-4 mb-2">
                  8. Cookies
                </h2>
                <p className="text-gray-600">
                  OYSLOE uses cookies and similar technologies to enhance user experience, analyze usage, and improve our services. You may manage cookie preferences through your browser settings.
                </p>
              </section>

              {/* Section 9 */}
              <section>
                <h2 className="text-xl font-semibold text-(--dark-def) mt-4 mb-2">
                  9. Third-Party Links
                </h2>
                <p className="text-gray-600">
                  The Platform may contain links to third-party websites or services. OYSLOE is not responsible for the privacy practices or content of those third parties.
                </p>
              </section>

              {/* Section 10 */}
              <section>
                <h2 className="text-xl font-semibold text-(--dark-def) mt-4 mb-2">
                  10. Children's Privacy
                </h2>
                <p className="text-gray-600">
                  OYSLOE is not intended for use by individuals under the age of 18. We do not knowingly collect personal information from minors.
                </p>
              </section>

              {/* Section 11 */}
              <section>
                <h2 className="text-xl font-semibold text-(--dark-def) mt-4 mb-2">
                  11. Changes to This Privacy Policy
                </h2>
                <p className="text-gray-600">
                  We may update this Privacy Policy from time to time. Any changes will be posted on the Platform, and continued use of OYSLOE constitutes acceptance of the updated Policy.
                </p>
              </section>

              {/* Section 12 */}
              <section>
                <h2 className="text-xl font-semibold text-(--dark-def) mt-4 mb-2">
                  12. Contact Us
                </h2>
                <p className="text-gray-600">
                  If you have any questions or concerns about this Privacy Policy or how your data is handled, please contact us:
                </p>
                <div className="border rounded-lg p-4 mt-3 space-y-2" style={{backgroundColor: 'rgba(116, 255, 167, 0.1)', borderColor: 'rgba(116, 255, 167, 0.3)'}}>
                  <p className="text-gray-700">
                    <strong>OYSLOE</strong>
                  </p>
                  <p className="text-gray-600">
                    <strong>Email:</strong> <a href="mailto:agbolod27@gmail.com" className="text-(--dark-def) hover:underline">agbolod27@gmail.com</a>
                  </p>
                  <p className="text-gray-600">
                    <strong>Phone:</strong> <a href="tel:+233552892433" className="text-(--dark-def) hover:underline">+233552892433</a>
                  </p>
                </div>
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

export default PrivacyPage;
