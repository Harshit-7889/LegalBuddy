    import React, { createContext, useContext, useEffect, useMemo, useState } from 'react'
    import { useNavigate } from 'react-router-dom'
    import { api, setAuthTokens, getAuthTokens } from '../services/api'
    import { notify } from '../services/notify'

    const AuthContext = createContext({
      user: null,
      token: null,
      login: async (_email, _password) => {},
      register: async (_name, _email, _password, _roleCode) => {},
      logout: () => {},
    })

    export const AuthProvider = ({ children }) => {
      const [user, setUser] = useState(null)
      const [token, setToken] = useState(null)
      const navigate = useNavigate()

      useEffect(() => {
        const stored = localStorage.getItem('auth')
        if (stored) {
          try {
            const parsed = JSON.parse(stored)
            setToken(parsed.token || null)
            setUser(parsed.user || null)
          } catch {}
        }
      }, [])

      useEffect(() => {
        // tokens are now managed in localStorage via api service
      }, [token])

  const login = async (email, password) => {
    const res = await api.login(email, password)
    setToken(res.access_token)
    const me = await api.getMe()
    setUser(me)
    setAuthTokens({ user: me })
    navigate('/')
    return me
  }

  const register = async ({ name, email, password, roleCode, legal_id_number }) => {
    await api.register({ name, email, password, roleCode, legal_id_number })
        notify.success('Registration successful!')
        return await login(email, password)
      }

      const logout = () => {
        setUser(null)
        setToken(null)
        localStorage.removeItem('auth')
        navigate('/login')
      }

      const sendVerificationCode = async (email) => api.sendVerificationCode(email)
      const verifyEmailCode = async (email, code) => api.verifyEmailCode(email, code)
      const forgotPassword = async (email) => api.forgotPassword(email)
      const resetPassword = async (token, new_password) => api.resetPassword(token, new_password)

      const value = useMemo(() => ({ user, token, login, register, logout, sendVerificationCode, verifyEmailCode, forgotPassword, resetPassword }), [user, token])

      return (
        <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
      )
    }

    export const useAuth = () => useContext(AuthContext)


