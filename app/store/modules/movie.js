import Vue from 'vue'
import movieApi from '../../api/movie'

const state = {
  movies: {}
}

const getters = {
  getMovie: state => tmdbId => state.movies[tmdbId] || { loading: null },
  allMovies: state => state.movies
}

const actions = {
  loadMovie ({ commit }, { tmdbId }) {
    commit('MOVIE_REQUEST', { tmdbId })
    return movieApi.get(tmdbId).then(data => {
      commit('MOVIE_REQUEST_SUCCESS', { tmdbId, movie: data.movie })
    }).catch(error => {
      commit('MOVIE_REQUEST_ERROR', { tmdbId, error })
    })
  },

  setMovieWatchLater ({ commit }, { tmdbId }) {
    return movieApi.setWatchLater(tmdbId).then(res => {
      commit('SET_MOVIE_WATCH_LATER', { tmdbId })
      return res
    })
  },
  setMovieIgnored ({ commit }, { tmdbId }) {
    return movieApi.setIgnored(tmdbId).then(res => {
      commit('SET_MOVIE_IGNORED', { tmdbId })
      return res
    })
  }
}

const mutations = {
  LOGOUT (state) {
    Vue.set(state, 'movies', {})
  },

  MOVIE_REQUEST (state, { tmdbId }) {
    Vue.set(state.movies, tmdbId, { loading: true })
  },

  MOVIE_REQUEST_SUCCESS (state, { tmdbId, movie }) {
    Vue.set(state.movies, tmdbId, { loading: false, data: movie })
  },

  MOVIE_REQUEST_ERROR (state, { tmdbId, error }) {
    Vue.set(state.movies, tmdbId, { loading: false, error })
  }
}

export default { state, getters, actions, mutations }
