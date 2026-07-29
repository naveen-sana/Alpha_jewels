const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

export const validateEmail = (email) => {
  if (!email?.trim()) return 'Email is required'
  if (!EMAIL_REGEX.test(email.trim())) return 'Enter a valid email address'
  return ''
}

export const validatePassword = (password, minLength = 8) => {
  if (!password) return 'Password is required'
  if (password.length < minLength) {
    return `Password must be at least ${minLength} characters`
  }
  return ''
}

export const validateConfirmPassword = (password, confirmPassword) => {
  if (!confirmPassword) return 'Please confirm your password'
  if (password !== confirmPassword) return 'Passwords do not match'
  return ''
}

export const validateRequired = (value, label) => {
  if (!value?.trim()) return `${label} is required`
  return ''
}

export const validatePhone = (phone) => {
  if (!phone?.trim()) return 'Mobile number is required'
  const digits = phone.replace(/\D/g, '')
  if (digits.length < 10) return 'Enter a valid mobile number'
  return ''
}
