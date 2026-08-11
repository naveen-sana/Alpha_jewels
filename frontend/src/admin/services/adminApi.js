import axios from 'axios'
import { API_BASE_URL } from '../../utils/constants'

const BASE_URLS = [API_BASE_URL, '']

const isValidApiResponse = (res) => {
  if (!res || res.data === undefined || res.data === null) return false
  if (typeof res.data === 'string' && (res.data.includes('<!DOCTYPE') || res.data.includes('<html'))) {
    return false
  }
  if (res.data && res.data.error === 'Unauthorized') {
    return false
  }
  return true
}

export const adminApi = {
  get: async (endpoint, config = {}) => {
    let lastError = null
    for (const baseUrl of BASE_URLS) {
      try {
        const url = baseUrl ? `${baseUrl}${endpoint}` : endpoint
        const res = await axios.get(url, config)
        if (isValidApiResponse(res)) return res
      } catch (err) {
        lastError = err
      }
    }
    throw lastError || new Error(`GET request failed for ${endpoint}`)
  },

  post: async (endpoint, data, config = {}) => {
    let lastError = null
    for (const baseUrl of BASE_URLS) {
      try {
        const url = baseUrl ? `${baseUrl}${endpoint}` : endpoint
        const res = await axios.post(url, data, config)
        if (isValidApiResponse(res)) return res
      } catch (err) {
        lastError = err
      }
    }
    throw lastError || new Error(`POST request failed for ${endpoint}`)
  },

  put: async (endpoint, data, config = {}) => {
    let lastError = null
    for (const baseUrl of BASE_URLS) {
      try {
        const url = baseUrl ? `${baseUrl}${endpoint}` : endpoint
        const res = await axios.put(url, data, config)
        if (isValidApiResponse(res)) return res
      } catch (err) {
        lastError = err
      }
    }
    throw lastError || new Error(`PUT request failed for ${endpoint}`)
  },

  patch: async (endpoint, data, config = {}) => {
    let lastError = null
    for (const baseUrl of BASE_URLS) {
      try {
        const url = baseUrl ? `${baseUrl}${endpoint}` : endpoint
        const res = await axios.patch(url, data, config)
        if (isValidApiResponse(res)) return res
      } catch (err) {
        lastError = err
      }
    }
    throw lastError || new Error(`PATCH request failed for ${endpoint}`)
  },

  delete: async (endpoint, config = {}) => {
    let lastError = null
    for (const baseUrl of BASE_URLS) {
      try {
        const url = baseUrl ? `${baseUrl}${endpoint}` : endpoint
        const res = await axios.delete(url, config)
        if (isValidApiResponse(res)) return res
      } catch (err) {
        lastError = err
      }
    }
    throw lastError || new Error(`DELETE request failed for ${endpoint}`)
  }
}
