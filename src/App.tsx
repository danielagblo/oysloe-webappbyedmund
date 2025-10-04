import { Route, Routes } from 'react-router-dom'
import './App.css'
import LogInPage from './pages/LogInPage.tsx'
import ReferalVerificationPage from './pages/ReferalVerificationPage.tsx'
import ResetPasswordWithEmailPage from './pages/ResetPasswordWithEmailPage.tsx'
import ResetPasswordWithPhonePage from './pages/ResetPasswordWithPhonePage.tsx'
import SignUpPage from './pages/SignUpPage.tsx'
import VerificationPage from './pages/VerificationPage.tsx'

function App() {

  return (
    <>
      <Routes>
        <Route path="/log-in" element={<LogInPage />} />
        <Route path="/sign-up" element={<SignUpPage />} />
        <Route path="/reset-password/phone" element={<ResetPasswordWithPhonePage />} />
        <Route path="/reset-password/email" element={<ResetPasswordWithEmailPage />} />
        <Route path="/verification" element={<VerificationPage />} />
        <Route path="/referal-verification" element={<ReferalVerificationPage />} />
      </Routes>
    </>
  )
}

export default App
