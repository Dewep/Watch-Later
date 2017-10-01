import http from './http'

export default {
  runTask (taskName, parameters) {
    return http.post(`/api/admin/${taskName}/`, parameters)
  }
}
