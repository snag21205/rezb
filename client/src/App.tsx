import { Routes, Route, Navigate } from 'react-router-dom'
import { Toaster } from 'react-hot-toast'
import { AuthProvider } from './contexts/AuthContext'
import { ProtectedRoute, PublicRoute } from './components/auth/ProtectedRoute'

// Pages
import LoginPage from './pages/LoginPage'
import RegisterPage from './pages/RegisterPage'
import VerifyEmailSentPage from './pages/VerifyEmailSentPage'
import AuthCallbackPage from './pages/AuthCallbackPage'
import DashboardLayout from './components/layout/DashboardLayout'
import DashboardPage from './pages/DashboardPage'
import CVAnalysisPage from './pages/CVAnalysisPage'
import JDMatchingPage from './pages/JDMatchingPage'
import InterviewPage from './pages/InterviewPage'
import InterviewSessionPage from './pages/InterviewSessionPage'
import HistoryPage from './pages/HistoryPage'

export default function App() {
  return (
    <AuthProvider>
      <Toaster
        position="top-right"
        toastOptions={{
          style: {
            background: 'var(--color-paper)',
            color: 'var(--color-charcoal)',
            border: '1px solid var(--color-mist)',
            borderRadius: 'var(--radius-md)',
            fontFamily: 'var(--font-sans)',
            fontSize: '14px',
          },
        }}
      />
      <Routes>
        {/* Public auth routes */}
        <Route element={<PublicRoute />}>
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />
          <Route path="/verify-email-sent" element={<VerifyEmailSentPage />} />
        </Route>

        {/* Email confirmation callback route */}
        <Route path="/auth/callback" element={<AuthCallbackPage />} />

        {/* Protected dashboard routes */}
        <Route element={<ProtectedRoute />}>
          <Route element={<DashboardLayout />}>
            <Route path="/dashboard" element={<DashboardPage />} />
            <Route path="/cv-analysis" element={<CVAnalysisPage />} />
            <Route path="/jd-matching" element={<JDMatchingPage />} />
            <Route path="/interview" element={<InterviewPage />} />
            <Route path="/interview/:id" element={<InterviewSessionPage />} />
            <Route path="/history" element={<HistoryPage />} />
          </Route>
        </Route>

        {/* Fallbacks */}
        <Route path="/" element={<Navigate to="/dashboard" replace />} />
        <Route path="*" element={<Navigate to="/dashboard" replace />} />
      </Routes>
    </AuthProvider>
  )
}
