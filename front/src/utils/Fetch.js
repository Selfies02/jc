import axios from 'axios'
import config from '../config'

const fullBackendUrl = config.getFullBackendUrl()

const api = axios.create({
  baseURL: `${fullBackendUrl}/api`,
  headers: {
    'Content-Type': 'application/json',
  },
})

api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('Jet-Cargo_jwt_login') || ''
    if (token) {
      config.headers['Authorization'] = `Bearer ${token}`
    }
    return config
  },
  (error) => {
    return Promise.reject(error)
  },
)

api.interceptors.response.use(
  (response) => {
    return response
  },
  async (error) => {
    const originalRequest = error.config

    if (error.response && error.response.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true

      try {
        const refreshToken = localStorage.getItem('Jet-Cargo_refresh_token')

        const response = await api.post('/auth/refresh-token', { refreshToken })

        localStorage.setItem('Jet-Cargo_jwt_login', response.data.token)
        localStorage.setItem('Jet-Cargo_refresh_token', response.data.refreshToken)

        originalRequest.headers['Authorization'] = `Bearer ${response.data.token}`

        return api(originalRequest)
      } catch (error) {
        localStorage.clear()
        window.location.href = '/login'
      }
    }

    return Promise.reject(error)
  },
)

export default api
