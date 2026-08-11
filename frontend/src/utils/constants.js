// Production Render API Endpoint: https://alpha-jewels-1.onrender.com
const envUrl = import.meta.env.VITE_API_URL
export const API_BASE_URL = (envUrl && typeof envUrl === 'string' && envUrl.trim().startsWith('http'))
  ? envUrl.trim()
  : 'https://alpha-jewels-1.onrender.com'

export const STORAGE_KEYS = {
  TOKEN: 'jewellery_token',
  USER: 'jewellery_user',
  REMEMBER_EMAIL: 'jewellery_remember_email',
}

export const THEME = {
  gold: '#D4AF37',
  black: '#121212',
  white: '#FFFFFF',
  cream: '#F5F0E8',
}
