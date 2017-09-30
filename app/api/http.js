import Vue from 'vue'
import app from './app'

const throttle = (callback) => {
  // return callback()
  return new Promise(resolve => setTimeout(resolve, 100)).then(callback)
}

const APIError = (error, uri, options, data) => {
  if (!options) {
    options = {}
  }

  if (error.status === 502) {
    return Promise.reject('Impossible de contacter les serveurs (problème réseau)')
  }

  if (error.status === 0) {
    return Promise.reject('Aucune connexion internet')
  }

  if (error.status === 401 && options.catchUnauthorized !== false) {
    app.store.dispatch('logout')
  }

  if (error.body) {
    if (error.body.error) {
      return Promise.reject(error.body.error)
    }

    return Promise.reject(error.body)
  }

  return Promise.reject(error)
}

const wrapRequest = (uri, options, makeRequest) => {
  return throttle(() => {
    if (!options) {
      options = {}
    }
    if (!options.headers) {
      options.headers = {}
    }
    if (!options.headers.Authorization) {
      const apiKey = app.store.getters.apiKey
      if (apiKey) {
        options.headers.Authorization = apiKey
      }
    }

    const request = makeRequest(uri, options)

    if (options.formatResponse !== false) {
      return request.then(response => response.body)
        .catch(err => APIError(err, uri, options))
    }

    return request
  })
}

export default {
  get (uri, options) {
    return wrapRequest(uri, options, (uri, options) => Vue.http.get(uri, options))
  },

  delete (uri, options) {
    return wrapRequest(uri, options, (uri, options) => Vue.http.delete(uri, options))
  },

  post (uri, data, options) {
    return wrapRequest(uri, options, (uri, options) => Vue.http.post(uri, data, options))
  },

  put (uri, data, options) {
    return wrapRequest(uri, options, (uri, options) => Vue.http.put(uri, data, options))
  }
}
