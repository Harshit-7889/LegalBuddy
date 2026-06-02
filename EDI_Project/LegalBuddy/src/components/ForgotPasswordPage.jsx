import React, { useState } from 'react'
import { useAuth } from '../context/AuthContext'
import { Input } from './ui/Input'
import { Button } from './ui/Button'
import { notify } from '../services/notify'
import AuthLayout from './AuthLayout'

export default function ForgotPasswordPage() {
  const { forgotPassword } = useAuth()
  const [email, setEmail] = useState('')
  const [sent, setSent] = useState(false)
  const [loading, setLoading] = useState(false)

  const onSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    await forgotPassword(email)
    notify.success('If an account exists, a reset link has been sent.')
    setSent(true)
    setLoading(false)
  }

  return (
    <AuthLayout title="Forgot Password" subtitle="Enter your email to receive a reset link.">
      {sent ? (
        <div className="text-sm">If an account exists, a reset link has been sent.</div>
      ) : (
        <form onSubmit={onSubmit} className="space-y-4">
          <Input type="email" placeholder="you@example.com" value={email} onChange={(e)=>setEmail(e.target.value)} />
          <Button type="submit" className="w-full" disabled={loading || !email}>{loading ? 'Sending...' : 'Send reset link'}</Button>
        </form>
      )}
    </AuthLayout>
  )
}


