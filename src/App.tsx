import { useEffect, useState } from "react";
import { Route, Routes, useLocation } from "react-router-dom";
import "./App.css";
import RequireAuth from "./components/RequireAuth";
import ScrollToTop from "./components/ScrollToTop";
import FcmNotificationHandler from "./components/FcmNotificationHandler";
import CompleteStepsModal from "./components/CompleteStepsModal";
import Footer from "./components/Footer";
import AdsDetailsPage from "./pages/AdsDetailsPage.tsx";
import AlertsPage from "./pages/AlertsPage.tsx";
import HomePage from "./pages/HomePage.tsx";
import InboxPage from "./pages/InboxPage.tsx";
import LogInPage from "./pages/LogInPage.tsx";
import PaystackCallback from "./pages/PaystackCallback";
import PostAdPage from "./pages/PostAdPage.tsx";
import ProfilePage from "./pages/ProfilePage.tsx";
import ReferalVerificationPage from "./pages/ReferalVerificationPage.tsx";
import ResetPasswordPage from "./pages/ResetPasswordPage.tsx";
import ResetPasswordWithEmailPage from "./pages/ResetPasswordWithEmailPage.tsx";
import ResetPasswordWithPhonePage from "./pages/ResetPasswordWithPhonePage.tsx";
import ReviewPage from "./pages/ReviewPage.tsx";
import SignUpPage from "./pages/SignUpPage.tsx";
import VerificationPage from "./pages/VerificationPage.tsx";
import ServiceApplicationPage from "./pages/ServiceApplicationPage.tsx";
import HowToSellPage from "./pages/HowToSellPage.tsx";
import FAQPage from "./pages/FAQPage.tsx";
import HiringPage from "./pages/HiringPage.tsx";
import SellAnythingPage from "./pages/SellAnythingPage.tsx";
import SellCarPage from "./pages/SellCarPage.tsx";
import SellPropertyPage from "./pages/SellPropertyPage.tsx";
import SellPhonePage from "./pages/SellPhonePage.tsx";
import SellAppliancePage from "./pages/SellAppliancePage.tsx";
import InvestPage from "./pages/InvestPage.tsx";
import PrivacyPage from "./pages/PrivacyPage.tsx";
import TermsPage from "./pages/TermsPage.tsx";
import SellElectronicsPage from "./pages/SellElectronicsPage.tsx";
import SellFashionPage from "./pages/SellFashionPage.tsx";
import SellFurniturePage from "./pages/SellFurniturePage.tsx";
import SellMotorcyclePage from "./pages/SellMotorcyclePage.tsx";
import SellBooksPage from "./pages/SellBooksPage.tsx";
import SellSportsPage from "./pages/SellSportsPage.tsx";
import SellBeautyPage from "./pages/SellBeautyPage.tsx";
import SellJewelryPage from "./pages/SellJewelryPage.tsx";
import BillingPage from "./pages/BillingPage.tsx";
import AboutPage from "./pages/AboutPage.tsx";

function App() {
  const [showCompleteSteps, setShowCompleteSteps] = useState(false);
  const location = useLocation();

  const authPaths = new Set([
    "/login",
    "/signUp",
    "/reset-password/phone",
    "/enterphone",
    "/reset-password/email",
    "/verification",
    "/referal-verification",
    "/resetpassword",
    "/resetpassword/new",
  ]);

  const isHomepage = location.pathname === "/" || location.pathname === "/homepage";
  const isAuthScreen = authPaths.has(location.pathname);
  const isAdsDetails = location.pathname.startsWith("/ads/");
  const showFooter = isHomepage || isAuthScreen || isAdsDetails;

  // Detect iOS Safari and add class to root element
  useEffect(() => {
    const ua = navigator.userAgent;
    const isiOS =
      /iPad|iPhone|iPod/.test(ua) ||
      (navigator.platform === "MacIntel" && navigator.maxTouchPoints > 1);
    if (isiOS) {
      document.documentElement.classList.add("ios");
    }
  }, []);

  // Check if user just logged in and set up timer to show Complete Steps modal after 2 minutes
  useEffect(() => {
    const checkLoginTimestamp = () => {
      try {
        const loginTimestamp = localStorage.getItem("oysloe_just_logged_in");
        if (!loginTimestamp) {
          console.log("No login timestamp found");
          return;
        }

        const loginTime = parseInt(loginTimestamp, 10);
        const currentTime = Date.now();
        const twoMinutesInMs = 2 * 60 * 1000; // 2 minutes in milliseconds
        const timeElapsed = currentTime - loginTime;
        const remainingSeconds = Math.ceil((twoMinutesInMs - timeElapsed) / 1000);

        console.log(`Login detected! Time elapsed: ${Math.floor(timeElapsed / 1000)}s`);
        console.log(`Complete Steps modal will show in ${remainingSeconds}s (${Math.floor(remainingSeconds / 60)}m ${remainingSeconds % 60}s)`);

        if (timeElapsed >= twoMinutesInMs) {
          // Show the modal
          console.log("2 minutes elapsed! Showing Complete Steps modal now");
          setShowCompleteSteps(true);
          // Remove the timestamp so we don't show it again
          localStorage.removeItem("oysloe_just_logged_in");
        } else {
          // Set timeout for remaining time
          const remainingTime = twoMinutesInMs - timeElapsed;
          
          // Log countdown every 10 seconds
          const countdownInterval = setInterval(() => {
            const currentTimeNow = Date.now();
            const timeElapsedNow = currentTimeNow - loginTime;
            const remainingSecondsNow = Math.ceil((twoMinutesInMs - timeElapsedNow) / 1000);
            
            if (remainingSecondsNow > 0) {
              console.log(`⏱️ Complete Steps modal countdown: ${remainingSecondsNow}s remaining (${Math.floor(remainingSecondsNow / 60)}m ${remainingSecondsNow % 60}s)`);
            }
          }, 10000); // Log every 10 seconds

          const timer = setTimeout(() => {
            console.log("✅ 2 minutes complete! Showing Complete Steps modal");
            setShowCompleteSteps(true);
            localStorage.removeItem("oysloe_just_logged_in");
            clearInterval(countdownInterval);
          }, remainingTime);

          return () => {
            clearTimeout(timer);
            clearInterval(countdownInterval);
          };
        }
      } catch {
        // ignore storage errors
      }
    };

    checkLoginTimestamp();
  }, [location]); // Check whenever route changes

  return (
    <div className="flex flex-col min-h-screen w-full">
      <ScrollToTop />
      <FcmNotificationHandler />
      <CompleteStepsModal 
        isOpen={showCompleteSteps} 
        onClose={() => setShowCompleteSteps(false)} 
      />
      <main className="flex-1">
        <Routes>
          <Route path="/login" element={<LogInPage />} />
          <Route path="/signUp" element={<SignUpPage />} />
          <Route
            path="/reset-password/phone"
            element={<ResetPasswordWithPhonePage />}
          />
          <Route
            path="/enterphone"
            element={
              <ResetPasswordWithPhonePage page="OTP Login" />
            }
          />
          <Route
            path="/reset-password/email"
            element={<ResetPasswordWithEmailPage />}
          />
          <Route path="/verification" element={<VerificationPage />} />
          <Route
            path="/referal-verification"
            element={<ReferalVerificationPage />}
          />
          <Route path="/resetpassword" element={<ResetPasswordPage />} />
          <Route path="/resetpassword/new" element={<ResetPasswordPage />} />
          <Route
            path="/"
            element={
              <RequireAuth>
                <HomePage />
              </RequireAuth>
            }
          />
          <Route
            path="/homepage"
            element={
              <RequireAuth>
                <HomePage />
              </RequireAuth>
            }
          />
          <Route
            path="/ads/:id"
            element={
              <RequireAuth>
                <AdsDetailsPage />
              </RequireAuth>
            }
          />
          <Route path="/reviews" element={<ReviewPage />} />
          <Route
            path="/postad"
            element={
              <RequireAuth>
                <PostAdPage />
              </RequireAuth>
            }
          />
          <Route
            path="/inbox"
            element={
              <RequireAuth>
                <InboxPage />
              </RequireAuth>
            }
          />
          <Route
            path="/profile"
            element={
              <RequireAuth>
                <ProfilePage />
              </RequireAuth>
            }
          />
          <Route
            path="/alerts"
            element={
              <RequireAuth>
                <AlertsPage />
              </RequireAuth>
            }
          />
          <Route
            path="/apply"
            element={
              <RequireAuth>
                <ServiceApplicationPage />
              </RequireAuth>
            }
          />
          <Route path="/paystack/callback" element={<PaystackCallback />} />
          <Route path="/how-to-sell" element={<HowToSellPage />} />
          <Route path="/faq" element={<FAQPage />} />
          <Route path="/hiring" element={<HiringPage />} />
          <Route path="/invest" element={<InvestPage />} />
          <Route path="/about" element={<AboutPage />} />
          <Route path="/privacy" element={<PrivacyPage />} />
          <Route path="/terms" element={<TermsPage />} />
          <Route path="/billing" element={<BillingPage />} />
          <Route path="/sell" element={<SellAnythingPage />} />
          <Route path="/sell/car" element={<SellCarPage />} />
          <Route path="/sell/property" element={<SellPropertyPage />} />
          <Route path="/sell/phone" element={<SellPhonePage />} />
          <Route path="/sell/appliance" element={<SellAppliancePage />} />
          <Route path="/sell/electronics" element={<SellElectronicsPage />} />
          <Route path="/sell/fashion" element={<SellFashionPage />} />
          <Route path="/sell/furniture" element={<SellFurniturePage />} />
          <Route path="/sell/motorcycle" element={<SellMotorcyclePage />} />
          <Route path="/sell/books" element={<SellBooksPage />} />
          <Route path="/sell/sports" element={<SellSportsPage />} />
          <Route path="/sell/beauty" element={<SellBeautyPage />} />
          <Route path="/sell/jewelry" element={<SellJewelryPage />} />
        </Routes>
      </main>
      {showFooter && <Footer />}
    </div>
  );
}

export default App;
