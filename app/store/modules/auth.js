import Vue from 'vue'
import authApi from '../../api/auth'

const state = {
  apiKey: null,
  user: null,
  request: null
}

const getters = {
  apiKey: state => state.apiKey || null,
  user: state => state.user || null,
  authRequest: state => state.request || { loading: false }
}

const actions = {
  auth ({ commit }, { email, password }) {
    commit('AUTH_REQUEST', {})
    return authApi.auth(email, password).then(data => {
      commit('AUTH_REQUEST_SUCCESS', data)
    }).catch(error => {
      commit('AUTH_REQUEST_ERROR', { error })
    })
  },

  autolog ({ commit }, { apiKey }) {
    commit('AUTH_REQUEST', {})
    return authApi.autolog(apiKey).then(data => {
      commit('AUTH_REQUEST_SUCCESS', { apiKey, user: data })
    }).catch(error => {
      commit('AUTH_REQUEST_ERROR', { error })
    })
  },

  logout ({ commit }) {
    commit('LOGOUT', {})
  }
}

const mutations = {
  LOGOUT (state) {
    Vue.set(state, 'apiKey', null)
    Vue.set(state, 'user', null)
    Vue.set(state, 'request', null)

    try {
      window.localStorage.removeItem('apiKey')
    } catch (err) {}
  },

  AUTH_REQUEST (state) {
    Vue.set(state, 'request', { loading: true })
  },

  AUTH_REQUEST_SUCCESS (state, { apiKey, user }) {
    Vue.set(state, 'apiKey', apiKey)
    Vue.set(state, 'user', user)
    Vue.set(state, 'request', { loading: false })

    try {
      window.localStorage.setItem('apiKey', apiKey)
    } catch (err) {}
  },

  AUTH_REQUEST_ERROR (state, { error }) {
    Vue.set(state, 'request', { loading: false, error })

    try {
      window.localStorage.removeItem('apiKey')
    } catch (err) {}
  }
}

export default { state, getters, actions, mutations }
