import apiClient from '../../api/client'
import { getToken } from '../../utils/storage'

const getAuthConfig = (config = {}) => {
  const token = getToken()
  const headers = config.headers || {}
  if (token && (!headers.Authorization || headers.Authorization.trim() === '' || headers.Authorization === 'Bearer ')) {
    headers.Authorization = `Bearer ${token}`
  }
  return { ...config, headers }
}

export const adminApi = {
  get: (endpoint, config) => apiClient.get(endpoint, getAuthConfig(config)),
  post: (endpoint, data, config) => apiClient.post(endpoint, data, getAuthConfig(config)),
  put: (endpoint, data, config) => apiClient.put(endpoint, data, getAuthConfig(config)),
  patch: (endpoint, data, config) => apiClient.patch(endpoint, data, getAuthConfig(config)),
  delete: (endpoint, config) => apiClient.delete(endpoint, getAuthConfig(config)),
}
