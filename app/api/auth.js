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
  }
}
