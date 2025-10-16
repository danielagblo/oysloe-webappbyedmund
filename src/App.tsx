import { Route, Routes } from 'react-router-dom'
import './App.css'
import AdsDetailsPage from './pages/AdsDetailsPage.tsx'
import AlertPage from './pages/AlertPage.tsx'
import HomePage from './pages/HomePage.tsx'
import InboxPage from './pages/InboxPage.tsx'
import LogInPage from './pages/LogInPage.tsx'
import ProfilePage from './pages/ProfilePage.tsx'
import ReferalVerificationPage from './pages/ReferalVerificationPage.tsx'
import ResetPasswordPage from './pages/ResetPasswordPage.tsx'
import ResetPasswordWithEmailPage from './pages/ResetPasswordWithEmailPage.tsx'
import ResetPasswordWithPhonePage from './pages/ResetPasswordWithPhonePage.tsx'
import ReviewPage from './pages/ReviewPage.tsx'
import SignUpPage from './pages/SignUpPage.tsx'
import VerificationPage from './pages/VerificationPage.tsx'
import SubscriptionPage from './pages/SubscriptionPage.tsx'
import AccountPage from './pages/AccountPage.tsx'
import FeedbackPage from './pages/FeedbackPage.tsx'
import PrivacyPage from './pages/PrivacyPage.tsx'
import ReferPage from './pages/ReferPage.tsx'
import PostAdPage from './pages/PostAdPage.tsx'

function App() {

  return (
    <>
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
        <Route path='/profile?tab=ads' element={<ProfilePage />} />
        <Route path='/profile?tab=favorite' element={<ReviewPage />} />
        <Route path='/profile?tab=subscription' element={<SubscriptionPage />} />
        <Route path='/profile?tab=refer' element={<ReferPage />} />
        <Route path='/profile?tab=feedback' element={<FeedbackPage />} />
        <Route path='/profile?tab=account' element={<AccountPage />} />
        <Route path='/profile?tab=privacy' element={<PrivacyPage />} />



      </Routes >
    </>
  )
}

export default App
