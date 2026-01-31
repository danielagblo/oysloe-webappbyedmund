import React from "react";
import { Helmet } from "react-helmet-async";
import { useNavigate } from "react-router-dom";

const HiringPage: React.FC = () => {
  const navigate = useNavigate();

  return (
    <>
      <Helmet>
        <title>Oysloe Careers | Join Our Ghana-Based E-commerce Team</title>
        <meta
          name="description"
          content="Careers at Oysloe Ghana - join our team of innovators building Africa's leading online marketplace. Open positions in engineering, design, and support."
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
              Join Oysloe - Careers in E-commerce
            </h1>
            <p className="text-gray-600 mb-4">
              Be part of Ghana's fastest-growing online marketplace. We're hiring talented engineers, designers, and support specialists to revolutionize e-commerce in Africa.
            </p>

            <div className="text-left space-y-6">
              {/* About Oysloe */}
              <section>
                <h2 className="text-2xl font-semibold text-(--dark-def) mb-3">
                  About Oysloe
                </h2>
                <p className="text-gray-600">
                  Oysloe is revolutionizing e-commerce in Ghana with a user-friendly marketplace platform.
                  We're building the future of digital commerce, connecting buyers and sellers seamlessly.
                </p>
              </section>

              {/* Why Join Us */}
              <section>
                <h2 className="text-2xl font-semibold text-(--dark-def) mb-3">
                  Why Join Oysloe?
                </h2>
                <ul className="list-disc list-inside text-gray-600 space-y-2 ml-2">
                  <li>Competitive salary and benefits package</li>
                  <li>Work with cutting-edge technology</li>
                  <li>Flexible work environment</li>
                  <li>Professional development opportunities</li>
                  <li>Be part of a mission-driven team</li>
                  <li>Collaborative and inclusive culture</li>
                </ul>
              </section>

              {/* Open Positions */}
              <section>
                <h2 className="text-2xl font-semibold text-(--dark-def) mb-3">
                  Open Positions
                </h2>
                <div className="space-y-4">
                  {/* Position 1 */}
                  <div className="border border-gray-200 rounded-lg p-4">
                    <h3 className="text-lg font-semibold text-(--dark-def) mb-2">
                      Software Engineer (Full-Stack)
                    </h3>
                    <p className="text-gray-600 text-sm mb-2">
                      We're looking for experienced full-stack developers to join our engineering team.
                    </p>
                    <p className="text-gray-500 text-xs">
                      <strong>Requirements:</strong> React, Node.js, TypeScript, Database design
                    </p>
                  </div>

                  {/* Position 2 */}
                  <div className="border border-gray-200 rounded-lg p-4">
                    <h3 className="text-lg font-semibold text-(--dark-def) mb-2">
                      Product Designer
                    </h3>
                    <p className="text-gray-600 text-sm mb-2">
                      Design beautiful and intuitive interfaces for our mobile and web platforms.
                    </p>
                    <p className="text-gray-500 text-xs">
                      <strong>Requirements:</strong> Figma, UI/UX, Mobile design, Prototyping
                    </p>
                  </div>

                  {/* Position 3 */}
                  <div className="border border-gray-200 rounded-lg p-4">
                    <h3 className="text-lg font-semibold text-(--dark-def) mb-2">
                      Customer Support Specialist
                    </h3>
                    <p className="text-gray-600 text-sm mb-2">
                      Provide excellent customer support and help resolve user issues.
                    </p>
                    <p className="text-gray-500 text-xs">
                      <strong>Requirements:</strong> Communication skills, Problem-solving, Patience
                    </p>
                  </div>

                  {/* Position 4 */}
                  <div className="border border-gray-200 rounded-lg p-4">
                    <h3 className="text-lg font-semibold text-(--dark-def) mb-2">
                      Marketing Specialist
                    </h3>
                    <p className="text-gray-600 text-sm mb-2">
                      Help grow Oysloe through strategic marketing initiatives.
                    </p>
                    <p className="text-gray-500 text-xs">
                      <strong>Requirements:</strong> Digital marketing, Social media, Analytics
                    </p>
                  </div>
                </div>
              </section>

              {/* Application Process */}
              <section>
                <h2 className="text-2xl font-semibold text-(--dark-def) mb-3">
                  How to Apply
                </h2>
                <p className="text-gray-600 mb-4">
                  Interested in joining our team? Send your resume and a cover letter to:
                </p>
                <div className="space-y-2">
                  <a
                    href="mailto:agblod27@gmail.com"
                    className="inline-block bg-(--green) text-(--dark-def) px-6 py-3 rounded-lg font-semibold hover:opacity-90 transition"
                  >
                    Apply Now - agblod27@gmail.com
                  </a>
                  <p className="text-gray-500 text-sm">
                    Or email us at: <a href="mailto:careers@oysloe.com" className="text-green-600 hover:underline">careers@oysloe.com</a>
                  </p>
                </div>
              </section>

              {/* Our Culture */}
              <section className="bg-blue-50 p-4 rounded-lg border border-blue-200">
                <h2 className="text-xl font-semibold text-(--dark-def) mb-3">
                  Our Culture
                </h2>
                <p className="text-gray-600">
                  We believe in creating a workplace where everyone can thrive. We value innovation,
                  collaboration, and continuous learning. Our team is diverse, talented, and passionate
                  about building the future of e-commerce.
                </p>
              </section>

              <p className="text-gray-500 text-sm mt-6 mb-10">
                Equal opportunity employer: Oysloe is committed to creating a diverse and inclusive workplace.
              </p>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default HiringPage;
