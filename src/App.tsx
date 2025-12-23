import { Route, Routes } from "react-router-dom";
import "./App.css";
import RequireAuth from "./components/RequireAuth";
import ScrollToTop from "./components/ScrollToTop";
import FcmNotificationHandler from "./components/FcmNotificationHandler";
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

function App() {
  return (
    <div className="flex flex-col min-h-screen w-full">
      <ScrollToTop />
      <FcmNotificationHandler />
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
      </Routes>
    </div>
  );
}

export default App;
