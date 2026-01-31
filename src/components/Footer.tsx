import React from "react";
import { Link } from "react-router-dom";

const Footer: React.FC = () => {
  return (
    <footer className="w-full bg-white border-t-2 mt-8" style={{borderColor: '#74ffa7'}}>
      <div className="max-w-6xl mx-auto px-4 py-8 sm:py-12">
        {/* Footer Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-6 sm:gap-8 mb-8">
          {/* Company */}
          <div>
            <h3 className="font-semibold text-(--dark-def) mb-4 text-sm sm:text-base pb-2 border-b-2" style={{borderColor: '#74ffa7'}}>
              Company
            </h3>
            <ul className="space-y-2">
              <li>
                <Link
                  to="/sell"
                  className="text-gray-600 transition text-xs sm:text-sm"
                  style={{transition: 'all 0.3s ease', cursor: 'pointer'}}
                  onMouseEnter={(e) => {e.currentTarget.style.color = '#74ffa7'; e.currentTarget.style.fontWeight = '500'}}
                  onMouseLeave={(e) => {e.currentTarget.style.color = '#4B5563'; e.currentTarget.style.fontWeight = 'normal'}}
                >
                  Sell Anything
                </Link>
              </li>
              <li>
                <Link
                  to="/how-to-sell"
                  className="text-gray-600 transition text-xs sm:text-sm"
                  style={{transition: 'all 0.3s ease', cursor: 'pointer'}}
                  onMouseEnter={(e) => {e.currentTarget.style.color = '#74ffa7'; e.currentTarget.style.fontWeight = '500'}}
                  onMouseLeave={(e) => {e.currentTarget.style.color = '#4B5563'; e.currentTarget.style.fontWeight = 'normal'}}
                >
                  How to Sell?
                </Link>
              </li>
              <li>
                <Link
                  to="/hiring"
                  className="text-gray-600 transition text-xs sm:text-sm"
                  style={{transition: 'all 0.3s ease', cursor: 'pointer'}}
                  onMouseEnter={(e) => {e.currentTarget.style.color = '#74ffa7'; e.currentTarget.style.fontWeight = '500'}}
                  onMouseLeave={(e) => {e.currentTarget.style.color = '#4B5563'; e.currentTarget.style.fontWeight = 'normal'}}
                >
                  Hiring
                </Link>
              </li>
              <li>
                <Link
                  to="/invest"
                  className="text-gray-600 transition text-xs sm:text-sm"
                  style={{transition: 'all 0.3s ease', cursor: 'pointer'}}
                  onMouseEnter={(e) => {e.currentTarget.style.color = '#74ffa7'; e.currentTarget.style.fontWeight = '500'}}
                  onMouseLeave={(e) => {e.currentTarget.style.color = '#4B5563'; e.currentTarget.style.fontWeight = 'normal'}}
                >
                  Invest in Oysloe
                </Link>
              </li>
              <li>
                <Link
                  to="/faq"
                  className="text-gray-600 transition text-xs sm:text-sm"
                  style={{transition: 'all 0.3s ease', cursor: 'pointer'}}
                  onMouseEnter={(e) => {e.currentTarget.style.color = '#74ffa7'; e.currentTarget.style.fontWeight = '500'}}
                  onMouseLeave={(e) => {e.currentTarget.style.color = '#4B5563'; e.currentTarget.style.fontWeight = 'normal'}}
                >
                  FAQ's
                </Link>
              </li>
            </ul>
          </div>

          {/* Help & Support */}
          <div>
            <h3 className="font-semibold text-(--dark-def) mb-4 text-sm sm:text-base pb-2 border-b-2" style={{borderColor: '#74ffa7'}}>
              Help & Support
            </h3>
            <ul className="space-y-2">
              <li>
                <Link
                  to="/faq"
                  className="text-gray-600 transition text-xs sm:text-sm"
                  style={{transition: 'all 0.3s ease', cursor: 'pointer'}}
                  onMouseEnter={(e) => {e.currentTarget.style.color = '#74ffa7'; e.currentTarget.style.fontWeight = '500'}}
                  onMouseLeave={(e) => {e.currentTarget.style.color = '#4B5563'; e.currentTarget.style.fontWeight = 'normal'}}
                >
                  Contact Us
                </Link>
              </li>
              <li>
                <Link
                  to="/billing"
                  className="text-gray-600 transition text-xs sm:text-sm"
                  style={{transition: 'all 0.3s ease', cursor: 'pointer'}}
                  onMouseEnter={(e) => {e.currentTarget.style.color = '#74ffa7'; e.currentTarget.style.fontWeight = '500'}}
                  onMouseLeave={(e) => {e.currentTarget.style.color = '#4B5563'; e.currentTarget.style.fontWeight = 'normal'}}
                >
                  Billing
                </Link>
              </li>
              <li>
                <a
                  href="mailto:agblod27@gmail.com"
                  className="text-gray-600 transition text-xs sm:text-sm"
                  style={{transition: 'all 0.3s ease', cursor: 'pointer'}}
                  onMouseEnter={(e) => {e.currentTarget.style.color = '#74ffa7'; e.currentTarget.style.fontWeight = '500'}}
                  onMouseLeave={(e) => {e.currentTarget.style.color = '#4B5563'; e.currentTarget.style.fontWeight = 'normal'}}
                >
                  Email Support
                </a>
              </li>
            </ul>
          </div>

          {/* Policies */}
          <div>
            <h3 className="font-semibold text-(--dark-def) mb-4 text-sm sm:text-base pb-2 border-b-2" style={{borderColor: '#74ffa7'}}>
              Policies
            </h3>
            <ul className="space-y-2">
              <li>
                <Link
                  to="/privacy"
                  className="text-gray-600 transition text-xs sm:text-sm"
                  style={{transition: 'all 0.3s ease', cursor: 'pointer'}}
                  onMouseEnter={(e) => {e.currentTarget.style.color = '#74ffa7'; e.currentTarget.style.fontWeight = '500'}}
                  onMouseLeave={(e) => {e.currentTarget.style.color = '#4B5563'; e.currentTarget.style.fontWeight = 'normal'}}
                >
                  Privacy Policy
                </Link>
              </li>
              <li>
                <Link
                  to="/terms"
                  className="text-gray-600 transition text-xs sm:text-sm"
                  style={{transition: 'all 0.3s ease', cursor: 'pointer'}}
                  onMouseEnter={(e) => {e.currentTarget.style.color = '#74ffa7'; e.currentTarget.style.fontWeight = '500'}}
                  onMouseLeave={(e) => {e.currentTarget.style.color = '#4B5563'; e.currentTarget.style.fontWeight = 'normal'}}
                >
                  Terms & Conditions
                </Link>
              </li>
            </ul>
          </div>

          {/* About */}
          <div>
            <h3 className="font-semibold text-(--dark-def) mb-4 text-sm sm:text-base pb-2 border-b-2" style={{borderColor: '#74ffa7'}}>
              About
            </h3>
            <ul className="space-y-2">
              <li>
                <Link
                  to="/about"
                  className="text-gray-600 transition text-xs sm:text-sm"
                  style={{transition: 'all 0.3s ease', cursor: 'pointer'}}
                  onMouseEnter={(e) => {e.currentTarget.style.color = '#74ffa7'; e.currentTarget.style.fontWeight = '500'}}
                  onMouseLeave={(e) => {e.currentTarget.style.color = '#4B5563'; e.currentTarget.style.fontWeight = 'normal'}}
                >
                  About Oysloe
                </Link>
              </li>
            </ul>
          </div>
        </div>

        {/* Divider */}
        <div className="border-t border-gray-200 pt-6 sm:pt-8">
          {/* Bottom Footer */}
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
            <p className="text-xs sm:text-sm text-gray-600 text-center sm:text-left">
              © {new Date().getFullYear()} Oysloe. All rights reserved.
            </p>
            <div className="flex gap-4">
              <a
                href="#"
                className="transition"
                style={{transition: 'all 0.3s ease', cursor: 'pointer', color: '#4B5563'}}
                onMouseEnter={(e) => {e.currentTarget.style.color = '#74ffa7'}}
                onMouseLeave={(e) => {e.currentTarget.style.color = '#4B5563'}}
                title="Facebook"
              >
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M19 3a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h14m-.5 15.5v-5.3a3.26 3.26 0 0 0-3.26-3.26c-.85 0-1.84.52-2.32 1.39v-1.2h-2.5v8.5h2.5v-4.34c0-.92.6-1.9 1.68-1.9 1.04 0 1.6.86 1.6 1.9v4.34h2.5M7 7a1.4 1.4 0 1 1 0 2.8A1.4 1.4 0 0 1 7 7m1.25 10.5h-2.5v-8.5h2.5z" />
                </svg>
              </a>
              <a
                href="#"
                className="transition"
                style={{transition: 'all 0.3s ease', cursor: 'pointer', color: '#4B5563'}}
                onMouseEnter={(e) => {e.currentTarget.style.color = '#74ffa7'}}
                onMouseLeave={(e) => {e.currentTarget.style.color = '#4B5563'}}
                title="Twitter"
              >
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M23 3a10.9 10.9 0 01-3.14 1.53 4.48 4.48 0 00-7.86 3v1A10.66 10.66 0 013 4s-4 9 5 13a11.64 11.64 0 01-7 2s9 5 20 5a9.5 9.5 0 00-9-5.5c4.75 2.25 7-7 7-7" />
                </svg>
              </a>
              <a
                href="#"
                className="transition"
                style={{transition: 'all 0.3s ease', cursor: 'pointer', color: '#4B5563'}}
                onMouseEnter={(e) => {e.currentTarget.style.color = '#74ffa7'}}
                onMouseLeave={(e) => {e.currentTarget.style.color = '#4B5563'}}
                title="Instagram"
              >
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                  <rect x="2" y="2" width="20" height="20" rx="5" ry="5" fill="none" stroke="currentColor" strokeWidth="2" />
                  <path d="M16 11.37A4 4 0 1112.63 8 4 4 0 0116 11.37z" fill="none" stroke="currentColor" strokeWidth="2" />
                  <circle cx="17.5" cy="6.5" r="1.5" fill="currentColor" />
                </svg>
              </a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
