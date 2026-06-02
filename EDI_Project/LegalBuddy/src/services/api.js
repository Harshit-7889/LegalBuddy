import { notify } from './notify'

const BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000'

const getAuthTokens = () => {
  try {
    const auth = JSON.parse(localStorage.getItem('auth'))
    return auth || {}
  } catch {
    return {}
  }
}

const setAuthTokens = (tokens) => {
  const current = getAuthTokens()
  const newAuth = { ...current, ...tokens }
  localStorage.setItem('auth', JSON.stringify(newAuth))
}

let isRefreshing = false
let failedQueue = []

const processQueue = (error, token = null) => {
  failedQueue.forEach(prom => {
    if (error) {
      prom.reject(error)
    } else {
      prom.resolve(token)
    }
  })
  failedQueue = []
}

const api = {
  async request(endpoint, options = {}) {
    const { accessToken } = getAuthTokens()
    const headers = {
      'Content-Type': 'application/json',
      ...options.headers,
    }

    if (accessToken) {
      headers.Authorization = `Bearer ${accessToken}`
    }

    let response = await fetch(`${BASE_URL}${endpoint}`, { ...options, headers })

    if (response.status === 401 && !options._isRetry) {
      if (isRefreshing) {
        return new Promise((resolve, reject) => {
          failedQueue.push({ resolve, reject })
        })
        .then(token => {
          options.headers.Authorization = `Bearer ${token}`
          return this.request(endpoint, { ...options, _isRetry: true })
        })
      }

      isRefreshing = true
      const { refreshToken } = getAuthTokens()
      if (!refreshToken) {
        localStorage.removeItem('auth')
        window.location.href = '/login'
        return Promise.reject(new Error('No refresh token'))
      }

      try {
        const refreshResponse = await fetch(`${BASE_URL}/auth/refresh`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ token: refreshToken }),
        })

        if (!refreshResponse.ok) throw new Error('Refresh failed')

        const newTokens = await refreshResponse.json()
        setAuthTokens({ accessToken: newTokens.access_token, refreshToken: newTokens.refresh_token })

        processQueue(null, newTokens.access_token)
        options.headers.Authorization = `Bearer ${newTokens.access_token}`
        return this.request(endpoint, { ...options, _isRetry: true })

      } catch (e) {
        processQueue(e, null)
        localStorage.removeItem('auth')
        window.location.href = '/login'
        return Promise.reject(e)
      } finally {
        isRefreshing = false
      }
    }

    return response
  },

  async login(email, password) {
    const params = new URLSearchParams()
    params.append('username', email)
    params.append('password', password)

    const response = await fetch(`${BASE_URL}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: params,
    })

    if (!response.ok) throw new Error('Invalid credentials')
    const tokens = await response.json()
    setAuthTokens({ accessToken: tokens.access_token, refreshToken: tokens.refresh_token })
    return tokens
  },

  async register({ name, email, password, roleCode, legal_id_number }) {
    const res = await this.request('/auth/register', {
      method: 'POST',
      body: JSON.stringify({
        name,
        email,
        password,
        role_code: roleCode || null,
        legal_id_number: legal_id_number || null,
      }),
    })
    if (!res.ok) throw new Error('Registration failed')
    return await res.json()
  },

  async getMe() {
    const res = await this.request('/users/me')
    if (!res.ok) throw new Error('Not authorized')
    return await res.json()
  },

  async sendVerificationCode(email) {
    const res = await fetch(`${BASE_URL}/auth/send-verification-code`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email }),
    })
    if (!res.ok) throw new Error('Failed to send code')
    return await res.json()
  },
  async verifyEmailCode(email, code) {
    const res = await fetch(`${BASE_URL}/auth/verify-email-code`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, code }),
    })
    if (!res.ok) throw new Error('Invalid code')
    return await res.json()
  },
  async forgotPassword(email) {
    const res = await fetch(`${BASE_URL}/auth/forgot-password`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email }),
    })
    if (!res.ok) throw new Error('Failed to send reset')
    return await res.json()
  },
  async resetPassword(token, new_password) {
    const res = await fetch(`${BASE_URL}/auth/reset-password`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ token, new_password }),
    })
    if (!res.ok) throw new Error('Failed to reset password')
    return await res.json()
  },

  async uploadDocument(file, actions) {
    const { accessToken } = getAuthTokens();
    const formData = new FormData();
    formData.append('file', file);
    actions.forEach(action => formData.append('actions', action));

    const headers = {};
    if (accessToken) {
      headers.Authorization = `Bearer ${accessToken}`;
    }

    const response = await fetch(`${BASE_URL}/docs/upload`, {
      method: 'POST',
      headers, // Do NOT set Content-Type, the browser handles it for FormData
      body: formData,
    });

    if (!response.ok) {
      throw new Error('File upload failed');
    }
    return await response.json();
  },

  async postQuestion(documentId, question) {
    const res = await this.request(`/docs/${documentId}/chat`, {
      method: 'POST',
      body: JSON.stringify({ question }),
    })
    if (!res.ok) {
      const error = await res.json()
      throw new Error(error.detail || 'Failed to get an answer')
    }
    return await res.json()
  },

  async getDocument(documentId) {
    const res = await this.request(`/docs/${documentId}`)
    if (!res.ok) {
      throw new Error('Could not fetch document details.')
    }
    return await res.json()
  },
}

export { api, setAuthTokens, getAuthTokens }


