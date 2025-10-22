import { Route, Routes } from 'react-router-dom'
import './App.css'
import AdsDetailsPage from './pages/AdsDetailsPage.tsx'
import AdsPage from './pages/AdsPage.tsx'
import AlertPage from './pages/AlertPage.tsx'
import FavoritePage from './pages/FavoritePage.tsx'
import FeedbackPage from './pages/FeedbackPage.tsx'
import HomePage from './pages/HomePage.tsx'
import InboxPage from './pages/InboxPage.tsx'
import LogInPage from './pages/LogInPage.tsx'
import PostAdPage from './pages/PostAdPage.tsx'
import PrivacyPage from './pages/PrivacyPage.tsx'
import ProfilePage from './pages/ProfilePage.tsx'
import ReferalVerificationPage from './pages/ReferalVerificationPage.tsx'
import ReferPage from './pages/ReferPage.tsx'
import ResetPasswordPage from './pages/ResetPasswordPage.tsx'
import ResetPasswordWithEmailPage from './pages/ResetPasswordWithEmailPage.tsx'
import ResetPasswordWithPhonePage from './pages/ResetPasswordWithPhonePage.tsx'
import ReviewPage from './pages/ReviewPage.tsx'
import SignUpPage from './pages/SignUpPage.tsx'
import SubscriptionPage from './pages/SubscriptionPage.tsx'
import VerificationPage from './pages/VerificationPage.tsx'
import TermsPage from './pages/TermsPage.tsx'

function App() {

  return (
    <div className="flex flex-col min-h-screen w-full">
      <Routes>
        <Route path="/login" element={<LogInPage />} />
        <Route path="/signUp" element={<SignUpPage />} />
        <Route path="/reset-password/phone" element={<ResetPasswordWithPhonePage />} />
        <Route path="/reset-password/email" element={<ResetPasswordWithEmailPage />} />
        <Route path="/verification" element={<VerificationPage />} />
        <Route path="/referal-verification" element={<ReferalVerificationPage />} />
        <Route path="/resetpassword" element={<ResetPasswordPage />} />
        <Route path="/homepage" element={<HomePage />} />
        <Route path="/ads/:id" element={<AdsDetailsPage />} />
        <Route path="/reviews" element={<ReviewPage />} />
        <Route path='/alerts' element={<AlertPage />} />
        <Route path='/postad' element={<PostAdPage />} />
        <Route path='/inbox' element={<InboxPage />} />
        <Route path='/profile' element={<ProfilePage />} />
        <Route path='/profile/ads' element={<AdsPage />} />
        <Route path='/profile/favorite' element={<FavoritePage />} />
        <Route path='/profile/subscription' element={<SubscriptionPage />} />
        <Route path='/profile/refer' element={<ReferPage />} />
        <Route path='/profile/feedback' element={<FeedbackPage />} />
        <Route path='/profile/privacy' element={<PrivacyPage />} />
        <Route path="/profile/terms" element={<TermsPage />} />



      </Routes >
    </div>
  )
}

export default App
