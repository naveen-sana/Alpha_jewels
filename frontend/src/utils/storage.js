import { STORAGE_KEYS } from './constants'

export const getToken = () => localStorage.getItem(STORAGE_KEYS.TOKEN)

export const setToken = (token) => {
  if (token) {
    localStorage.setItem(STORAGE_KEYS.TOKEN, token)
  } else {
    localStorage.removeItem(STORAGE_KEYS.TOKEN)
  }
}

export const getStoredUser = () => {
  const raw = localStorage.getItem(STORAGE_KEYS.USER)
  if (!raw) return null
  try {
    return JSON.parse(raw)
  } catch {
    return null
  }
}

export const setStoredUser = (user) => {
  if (user) {
    localStorage.setItem(STORAGE_KEYS.USER, JSON.stringify(user))
  } else {
    localStorage.removeItem(STORAGE_KEYS.USER)
  }
}

export const getRememberedEmail = () =>
  localStorage.getItem(STORAGE_KEYS.REMEMBER_EMAIL) || ''

export const setRememberedEmail = (email) => {
  if (email) {
    localStorage.setItem(STORAGE_KEYS.REMEMBER_EMAIL, email)
  } else {
    localStorage.removeItem(STORAGE_KEYS.REMEMBER_EMAIL)
  }
}

export const clearAuthStorage = () => {
  localStorage.removeItem(STORAGE_KEYS.TOKEN)
  localStorage.removeItem(STORAGE_KEYS.USER)
}
