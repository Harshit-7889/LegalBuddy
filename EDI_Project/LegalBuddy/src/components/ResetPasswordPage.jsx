import React, { useState } from 'react'
import { useSearchParams } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { Input } from './ui/Input'
import { Button } from './ui/Button'
import { notify } from '../services/notify'
import AuthLayout from './AuthLayout'

export default function ResetPasswordPage() {
  const { resetPassword } = useAuth()
  const [params] = useSearchParams()
  const token = params.get('token') || ''
  const [password, setPassword] = useState('')
  const [done, setDone] = useState(false)
  const [loading, setLoading] = useState(false)

  const onSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    await resetPassword(token, password)
    setDone(true)
    notify.success('Password updated successfully! You can now log in.')
    setLoading(false)
  }

  return (
    <AuthLayout title="Reset Password" subtitle="Enter a new password to regain access.">
      {done ? (
        <div className="text-sm">Password updated. You can now sign in.</div>
      ) : (
        <form onSubmit={onSubmit} className="space-y-4">
          <Input type="password" placeholder="New password" value={password} onChange={(e)=>setPassword(e.target.value)} />
          <Button type="submit" className="w-full" disabled={loading || !password}>{loading ? 'Saving...' : 'Reset password'}</Button>
        </form>
      )}
    </AuthLayout>
  )
}


