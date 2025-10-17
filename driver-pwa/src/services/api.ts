import axios from 'axios'

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000'

const api = axios.create({
  baseURL: `${API_BASE_URL}/api`,
  headers: {
    'Content-Type': 'application/json',
  },
})

// Request interceptor to add auth token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('driver_token')
    if (token) {
      config.headers.Authorization = `Bearer ${token}`
    }
    return config
  },
  (error) => {
    return Promise.reject(error)
  }
)

// Response interceptor to handle auth errors
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('driver_token')
      window.location.href = '/login'
    }
    return Promise.reject(error)
  }
)

export const authApi = {
  login: (phone: string, password: string) =>
    api.post('/auth/login', { phone, password }).then(res => res.data),
  
  getProfile: () =>
    api.get('/auth/profile').then(res => res.data),
}

export const assignmentsApi = {
  getAssignments: () =>
    api.get('/driver/assignments').then(res => res.data),
  
  getAssignment: (id: string) =>
    api.get(`/driver/assignments/${id}`).then(res => res.data),
  
  updateStatus: (id: string, status: string, data?: any) =>
    api.patch(`/driver/assignments/${id}/status`, { status, ...data }).then(res => res.data),
  
  submitReport: (id: string, data: any) =>
    api.post(`/driver/assignments/${id}/report`, data).then(res => res.data),
}

export const navigationApi = {
  getDirections: (origin: string, destination: string) =>
    api.get('/driver/navigation/directions', {
      params: { origin, destination }
    }).then(res => res.data),
  
  getCurrentLocation: () =>
    api.get('/driver/navigation/location').then(res => res.data),
}

export default api
