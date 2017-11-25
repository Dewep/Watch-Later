import http from './http'

export default {
  autolog (apiKey) {
    const headers = {}
    if (apiKey) {
      headers.Authorization = apiKey
    }
    return http.get('/api/auth/', { headers })
  },

  auth (email, password) {
    return http.post('/api/auth/', { email, password }, { catchUnauthorized: false })
  },

  logout (team) {
    return http.delete('/api/auth/', { catchUnauthorized: false })
  },

  recoverPasswordRequest (email) {
    return http.post('/api/auth/password/', { email })
  },
  recoverPassword (token, password) {
    return http.post(`/api/auth/password/${token}/`, { password })
  },

  updateProfile (data) {
    return http.put('/api/auth/', data)
  }
}
