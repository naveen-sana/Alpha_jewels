import apiClient from '../api/client'
import { isJwtToken } from '../utils/jwtUtils'

/**
 * Backend User entity fields: fullName, email, phone, password
 */
export const registerUser = async ({ fullName, email, phone, password }) => {
  const { data } = await apiClient.post('/api/users/register', {
    fullName,
    email,
    phone,
    password,
  })
  return data
}

/**
 * Backend returns JWT string on success, or plain-text error message.
 */
export const loginUser = async ({ email, password }) => {
  const cleanEmail = (email || '').trim()
  const cleanPassword = (password || '').trim()
  const { data } = await apiClient.post('/api/users/login', { email: cleanEmail, password: cleanPassword })

  if (typeof data === 'string' && !isJwtToken(data)) {
    throw new Error(data)
  }

  return data
}

export const logoutUser = async () => {
  const { data } = await apiClient.post('/api/users/logout')
  return data
}

/**
 * Backend ForgotPasswordRequest: { email }
 */
export const forgotPassword = async ({ email }) => {
  const { data } = await apiClient.post('/api/users/forgot-password', { email })
  return data
}

/**
 * Backend ResetPasswordRequest: { email, otp, newPassword }
 */
export const resetPassword = async ({ email, otp, newPassword }) => {
  const { data } = await apiClient.post('/api/users/reset-password', {
    email,
    otp,
    newPassword,
  })

  if (typeof data === 'string' && data.toLowerCase().includes('invalid')) {
    throw new Error(data)
  }

  return data
}

/**
 * Backend ChangePasswordRequest: { email, oldPassword, newPassword }
 */
export const changePassword = async ({ email, oldPassword, newPassword }) => {
  const { data } = await apiClient.post('/api/users/change-password', {
    email,
    oldPassword,
    newPassword,
  })

  if (typeof data === 'string' && data.toLowerCase().includes('invalid')) {
    throw new Error(data)
  }

  return data
}

export const extractErrorMessage = (error) => {
  if (error.code === 'ECONNABORTED' || error.message?.includes('timeout')) {
    return 'Server connection warming up. Please click SIGN IN again.'
  }
  if (error.response?.data) {
    const data = error.response.data
    if (typeof data === 'string') return data
    if (data.message) return data.message
    if (data.error) return data.error
  }
  return error.message || 'Something went wrong. Please try again.'
}
