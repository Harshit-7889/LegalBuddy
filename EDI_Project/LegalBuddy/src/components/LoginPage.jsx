import React, { useState } from 'react'
import { useAuth } from '../context/AuthContext'
import { Input } from './ui/Input'
import { Button } from './ui/Button'
import { Link } from 'react-router-dom'
import AuthLayout from './AuthLayout'

export default function LoginPage() {
  const { login } = useAuth()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const onSubmit = async (e) => {
    e.preventDefault()
    setError('')
    setLoading(true)
    try {
      await login(email, password)
    } catch (err) {
      setError(err?.message || 'Login failed')
    } finally {
      setLoading(false)
    }
  }

  return (
    <AuthLayout title="Welcome Back" subtitle="Please sign in to continue.">
      <form onSubmit={onSubmit} className="space-y-4">
        <Input type="email" value={email} onChange={(e)=>setEmail(e.target.value)} placeholder="you@example.com" />
        <Input type="password" value={password} onChange={(e)=>setPassword(e.target.value)} placeholder="Password" />
        {error && <div className="text-red-600 text-sm">{error}</div>}
        <Button type="submit" className="w-full" disabled={loading}>{loading ? 'Loading...' : 'Login'}</Button>
      </form>
      <div className="mt-4 text-center text-sm">
        <Link to="/register" className="text-primary font-medium hover:underline">Create an account</Link>
      </div>
      <div className="mt-2 text-center text-sm">
        <Link to="/forgot-password" className="text-body-grey hover:underline">Forgot password?</Link>
      </div>
    </AuthLayout>
  )
}


