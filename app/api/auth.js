import http from './http'

export default {
  autolog (apiKey) {
    const headers = {}
    if (apiKey) {
      headers.Authorization = apiKey
    }
    return http.get('/auth/', { headers })
  },

  auth (email, password) {
    return http.post('/auth/', { email, password }, { catchUnauthorized: false })
  },

  logout (team) {
    return http.delete('/auth/', { catchUnauthorized: false })
  }
}
