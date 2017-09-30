import http from './http'

export default {
  get (tmdbId) {
    return http.get(`/api/movie/${tmdbId}/`)
  },

  setWatchLater (tmdbId) {
    return http.post(`/api/movie/${tmdbId}/watch-later/`)
  },
  setIgnored (tmdbId) {
    return http.post(`/api/movie/${tmdbId}/ignored/`)
  }
}
