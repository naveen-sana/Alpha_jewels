import axios from 'axios'
import { API_BASE_URL } from '../utils/constants'
import { getToken, clearAuthStorage } from '../utils/storage'

const apiClient = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 15000,
})

// Attach JWT only to protected APIs
apiClient.interceptors.request.use(
  (config) => {
    const token = getToken()

    const publicUrls = [
      '/api/users/login',
      '/api/users/register',
      '/api/users/forgot-password',
      '/api/users/reset-password',
    ]

    if (token && !publicUrls.includes(config.url)) {
      config.headers.Authorization = `Bearer ${token}`
    }

    return config
  },
  (error) => Promise.reject(error)
)

// Handle authentication errors
apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      clearAuthStorage()

      if (window.location.pathname !== '/login') {
        window.location.href = '/login'
      }
    }

    return Promise.reject(error)
  }
)

export default apiClient