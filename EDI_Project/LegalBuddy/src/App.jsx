import React from 'react'
import { Routes, Route } from 'react-router-dom'
import HomePage from './components/HomePage'
import DemoControls from './components/DemoControls'
import { AuthProvider } from './context/AuthContext'
import { useAuth } from './context/AuthContext'
import TemplatesPage from './components/TemplatesPage'
import FAQPage from './components/FAQPage'
import ProfilePage from './components/ProfilePage'
import ProtectedRoute from './components/ProtectedRoute'
import LoginPage from './components/LoginPage'
import RegisterPage from './components/RegisterPage'
import ForgotPasswordPage from './components/ForgotPasswordPage'
import ResetPasswordPage from './components/ResetPasswordPage'
import ChatOnlyPage from './components/ChatOnlyPage'
import AboutPage from './components/AboutPage'
import ResourcesPage from './components/ResourcesPage'
import DocumentViewerPage from './components/DocumentViewerPage'
import { Toaster } from 'react-hot-toast'

function AppInner() {
  const { user } = useAuth()
  const role = user ? (user.role || 'user') : 'guest'
  const quota = role === 'guest'
    ? { uploadsRemaining: 3, uploadsTotal: 3, chatsRemaining: 10, chatsTotal: 10 }
    : role === 'user'
      ? { uploadsRemaining: 45, uploadsTotal: 50, chatsRemaining: 95, chatsTotal: 100 }
      : role === 'lawyer'
        ? { uploadsRemaining: 90, uploadsTotal: 100, chatsRemaining: 195, chatsTotal: 200 }
        : { uploadsRemaining: 999, uploadsTotal: 999, chatsRemaining: 999, chatsTotal: 999 }
  const showAdminWidget = role === 'admin'
  const showVerifiedBadge = role === 'lawyer'

  return (
    <div className="min-h-screen bg-neutral">
      <DemoControls currentRole={role} onRoleChange={() => {}} />
      <Routes>
        <Route path="/" element={
          <HomePage 
            role={role}
            quota={quota}
            showAdminWidget={showAdminWidget}
            showVerifiedBadge={showVerifiedBadge}
          />
        } />
        <Route path="/templates" element={<TemplatesPage />} />
        <Route path="/faq" element={<FAQPage />} />
        <Route path="/profile" element={<ProfilePage />} />
        <Route path="/chat" element={<ChatOnlyPage />} />
        <Route path="/about" element={<AboutPage />} />
        <Route path="/resources" element={<ResourcesPage />} />
        <Route path="/docs/:documentId" element={<DocumentViewerPage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route path="/forgot-password" element={<ForgotPasswordPage />} />
        <Route path="/reset-password" element={<ResetPasswordPage />} />
      </Routes>
    </div>
  )
}

export default function App() {
  return (
    <AuthProvider>
      <AppInner />
      <Toaster position="bottom-right" />
    </AuthProvider>
  )
}
