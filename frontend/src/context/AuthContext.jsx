import { createContext, useCallback, useEffect, useMemo, useState } from 'react'
import {
  loginUser,
  logoutUser,
  registerUser,
  forgotPassword,
  resetPassword,
  changePassword,
  extractErrorMessage,
} from '../services/authService'
import {
  getToken,
  setToken,
  getStoredUser,
  setStoredUser,
  clearAuthStorage,
  getRememberedEmail,
  setRememberedEmail,
} from '../utils/storage'
import { decodeJwtPayload } from '../utils/jwtUtils'

export const AuthContext = createContext(null)

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(() => getStoredUser())
  const [token, setTokenState] = useState(() => getToken())
  const [loading, setLoading] = useState(true)

  const isAuthenticated = Boolean(token && user)

  useEffect(() => {
    const storedToken = getToken() || localStorage.getItem('admin_token')
    if (storedToken) {
      const payload = decodeJwtPayload(storedToken)
      if (payload && payload.isExpired) {
        clearAuthStorage()
        setTokenState(null)
        setUser(null)
      } else {
        setTokenState(storedToken)
        const name = payload?.name || payload?.email || getStoredUser()?.fullName || localStorage.getItem('admin_name') || 'Admin User'
        const role = payload?.role || localStorage.getItem('user_role') || 'ADMIN'
        const email = payload?.email || localStorage.getItem('user_email') || 'admin@alphajewels.com'
        setUser({ email, role, fullName: name })
      }
    } else {
      setTokenState(null)
      setUser(null)
    }

    setLoading(false)
  }, [])

  const persistSession = useCallback((jwt, userData) => {
    setToken(jwt)
    setTokenState(jwt)
    const userName = userData?.fullName || userData?.name || userData?.email || ''
    setStoredUser(userName)
    setUser(userData)
  }, [])

  const login = useCallback(async (credentials, rememberEmail = false) => {
    const jwt = await loginUser(credentials)
    const payload = decodeJwtPayload(jwt)

    const userData = {
      email: payload?.email || credentials.email,
      role: payload?.role || 'USER',
      fullName: payload?.name || '',
    }

    persistSession(jwt, userData)

    if (rememberEmail) {
      setRememberedEmail(credentials.email)
    } else {
      setRememberedEmail('')
    }

    return userData
  }, [persistSession])

  const register = useCallback(async (payload) => {
    const registeredUser = await registerUser(payload)

    const userData = {
      id: registeredUser.id,
      fullName: registeredUser.fullName,
      email: registeredUser.email,
      phone: registeredUser.phone,
      role: registeredUser.role,
    }

    return userData
  }, [])

  const logout = useCallback(async () => {
    try {
      await logoutUser()
    } catch {
      // Clear local session even if backend logout fails
    } finally {
      clearAuthStorage()
      setTokenState(null)
      setUser(null)
    }
  }, [])

  const requestPasswordReset = useCallback(async (email) => {
    return forgotPassword({ email })
  }, [])

  const completePasswordReset = useCallback(async (payload) => {
    return resetPassword(payload)
  }, [])

  const updatePassword = useCallback(async (payload) => {
    return changePassword(payload)
  }, [])

  const updateProfile = useCallback((updates) => {
    setUser((prev) => {
      const next = { ...prev, ...updates }
      setStoredUser(next)
      return next
    })
  }, [])

  const value = useMemo(
    () => ({
      user,
      token,
      loading,
      isAuthenticated,
      rememberedEmail: getRememberedEmail(),
      login,
      register,
      logout,
      requestPasswordReset,
      completePasswordReset,
      updatePassword,
      updateProfile,
      getErrorMessage: extractErrorMessage,
    }),
    [
      user,
      token,
      loading,
      isAuthenticated,
      login,
      register,
      logout,
      requestPasswordReset,
      completePasswordReset,
      updatePassword,
      updateProfile,
    ]
  )

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}
