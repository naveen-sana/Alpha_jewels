import axios from 'axios'

const BASE_URLS = [
  '',
  'http://localhost:9090',
  'http://localhost:8080'
]

export const adminApi = {
  get: async (endpoint, config = {}) => {
    let lastError = null
    for (const baseUrl of BASE_URLS) {
      try {
        const url = baseUrl ? `${baseUrl}${endpoint}` : endpoint
        const res = await axios.get(url, config)
        if (res && res.data) return res
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
        if (res && res.data) return res
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
        if (res && res.data) return res
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
        if (res && res.data) return res
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
        if (res) return res
      } catch (err) {
        lastError = err
      }
    }
    throw lastError || new Error(`DELETE request failed for ${endpoint}`)
  }
}
