import { Route, Routes } from 'react-router-dom'
import './App.css'
import HomePage from './pages/HomePage.tsx'
import LogInPage from './pages/LogInPage.tsx'
import ReferalVerificationPage from './pages/ReferalVerificationPage.tsx'
import ResetPasswordPage from './pages/ResetPasswordPage.tsx'
import ResetPasswordWithEmailPage from './pages/ResetPasswordWithEmailPage.tsx'
import ResetPasswordWithPhonePage from './pages/ResetPasswordWithPhonePage.tsx'
import SignUpPage from './pages/SignUpPage.tsx'
import VerificationPage from './pages/VerificationPage.tsx'

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
      </Routes>
    </>
  )
}

export default App
