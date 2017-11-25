import Vue from 'vue'
import newsApi from '../../api/news'

const state = {
  news: null,
  request: null
}

const getters = {
  news: state => state.news || null,
  newsRequest: state => state.request || { loading: false }
}

const actions = {
  loadNews ({ commit }) {
    commit('NEWS_REQUEST', {})
    return newsApi.get().then(data => {
      commit('NEWS_REQUEST_SUCCESS', data)
    }).catch(error => {
      commit('NEWS_REQUEST_ERROR', { error })
    })
  },
  discardFirstNews ({ commit }) {
    commit('DISCARD_FIRST_NEWS', {})
  }
}

const mutations = {
  LOGOUT (state) {
    Vue.set(state, 'request', null)
    Vue.set(state, 'news', null)
  },
  UPDATE_PROFILE (state) {
    Vue.set(state, 'request', null)
    Vue.set(state, 'news', null)
  },

  NEWS_REQUEST (state) {
    Vue.set(state, 'request', { loading: true })
  },

  NEWS_REQUEST_SUCCESS (state, { news }) {
    Vue.set(state, 'news', news)
    Vue.set(state, 'request', { loading: false })
  },

  NEWS_REQUEST_ERROR (state, { error }) {
    Vue.set(state, 'request', { loading: false, error })
  },

  DISCARD_FIRST_NEWS (state) {
    if (state.news && state.news.length > 0) {
      const news = [...state.news]
      news.splice(0, 1)
      Vue.set(state, 'news', news)
    }
  }
}

export default { state, getters, actions, mutations }
