import { Routes, Route } from 'react-router-dom'

// Pages (will be implemented in later phases)
// import LandingPage from '@/pages/LandingPage'
// import LoginPage from '@/pages/LoginPage'
// import RegisterPage from '@/pages/RegisterPage'
// import DashboardPage from '@/pages/DashboardPage'
// import CVAnalysisPage from '@/pages/CVAnalysisPage'
// import JDMatchingPage from '@/pages/JDMatchingPage'
// import InterviewPage from '@/pages/InterviewPage'
// import InterviewSessionPage from '@/pages/InterviewSessionPage'
// import HistoryPage from '@/pages/HistoryPage'

// Layout
// import DashboardLayout from '@/components/layout/DashboardLayout'

function App() {
  return (
    <Routes>
      {/* Public routes */}
      <Route path="/" element={<PlaceholderPage title="Landing Page" />} />
      <Route path="/login" element={<PlaceholderPage title="Login" />} />
      <Route path="/register" element={<PlaceholderPage title="Register" />} />

      {/* Protected routes (will be wrapped in DashboardLayout) */}
      <Route path="/dashboard" element={<PlaceholderPage title="Dashboard" />} />
      <Route path="/cv-analysis" element={<PlaceholderPage title="CV Analysis" />} />
      <Route path="/jd-matching" element={<PlaceholderPage title="JD Matching" />} />
      <Route path="/interview" element={<PlaceholderPage title="Interview" />} />
      <Route path="/interview/:id" element={<PlaceholderPage title="Interview Session" />} />
      <Route path="/history" element={<PlaceholderPage title="History" />} />
    </Routes>
  )
}

// Temporary placeholder — will be replaced with actual pages
function PlaceholderPage({ title }: { title: string }) {
  return (
    <div style={{
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      minHeight: '100vh',
      gap: '1rem',
    }}>
      <h1 className="gradient-text" style={{ fontSize: '2rem', fontWeight: 700 }}>
        CV & Interview Coach
      </h1>
      <p style={{ color: 'var(--color-text-muted)' }}>
        📍 {title} — Coming soon
      </p>
    </div>
  )
}

export default App
