import React, { useState } from 'react'
import { useAuth } from '../context/AuthContext'
import { Input } from './ui/Input'
import { Button } from './ui/Button'
import AuthLayout from './AuthLayout'

export default function RegisterPage() {
  const { sendVerificationCode, verifyEmailCode, register } = useAuth()
  const [step, setStep] = useState(1)
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [code, setCode] = useState('')
  const [password, setPassword] = useState('')
  const [legalPro, setLegalPro] = useState(false)
  const [legalId, setLegalId] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const handleSendCode = async () => {
    setError('')
    setLoading(true)
    try {
      await sendVerificationCode(email)
      setStep(2)
    } catch (e) { setError('Failed to send code') } finally { setLoading(false) }
  }

  const handleVerify = async () => {
    setError('')
    setLoading(true)
    try {
      await verifyEmailCode(email, code)
      setStep(3)
    } catch (e) { setError('Invalid code') } finally { setLoading(false) }
  }

  const handleRegister = async () => {
    setError('')
    setLoading(true)
    try {
      await register({ name, email, password, roleCode: null, legal_id_number: legalPro ? legalId : null })
    } catch (e) { setError('Registration failed') } finally { setLoading(false) }
  }

  return (
    <AuthLayout title="Create Your Account" subtitle="Join LawAssist to get full access.">
      {step === 1 && (
        <div className="space-y-4">
          <Input placeholder="Full name" value={name} onChange={(e)=>setName(e.target.value)} />
          <Input type="email" placeholder="you@example.com" value={email} onChange={(e)=>setEmail(e.target.value)} />
          {error && <div className="text-red-600 text-sm">{error}</div>}
          <Button className="w-full" onClick={handleSendCode} disabled={loading || !email || !name}>{loading ? 'Sending...' : 'Send verification code'}</Button>
        </div>
      )}
      {step === 2 && (
        <div className="space-y-4">
          <Input placeholder="Verification code" value={code} onChange={(e)=>setCode(e.target.value)} />
          {error && <div className="text-red-600 text-sm">{error}</div>}
          <Button className="w-full" onClick={handleVerify} disabled={loading || !code}>{loading ? 'Verifying...' : 'Verify email'}</Button>
        </div>
      )}
      {step === 3 && (
        <div className="space-y-4">
          <Input type="password" placeholder="Password" value={password} onChange={(e)=>setPassword(e.target.value)} />
          <label className="flex items-center space-x-2">
            <input type="checkbox" checked={legalPro} onChange={(e)=>setLegalPro(e.target.checked)} />
            <span>I am a legal professional</span>
          </label>
          {legalPro && (
            <>
              <Input placeholder="Legal ID Number" value={legalId} onChange={(e)=>setLegalId(e.target.value)} />
            </>
          )}
          {error && <div className="text-red-600 text-sm">{error}</div>}
          <Button className="w-full" onClick={handleRegister} disabled={loading || !password}>{loading ? 'Creating...' : 'Create account'}</Button>
        </div>
      )}
    </AuthLayout>
  )
}


