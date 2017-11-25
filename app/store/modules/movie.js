import Vue from 'vue'
import movieApi from '../../api/movie'

const retry = {}

const state = {
  movies: {}
}

const getters = {
  getMovie: state => tmdbId => state.movies[tmdbId] || { loading: null },
  myMovies: (state, getters) => {
    const movies = {
      isLoading: false,
      toLoad: [],
      inTheatres: [],
      canBeDownloaded: [],
      others: []
    }

    getters.myMoviesIds.forEach(tmdbId => {
      const movie = getters.getMovie(tmdbId)

      if (movie.loading === null) {
        movies.isLoading = true
        movies.toLoad.push(tmdbId)
      } else if (movie.loading === true) {
        movies.isLoading = true
      }

      if (movie.data && movie.data.in_theatres) {
        movies.inTheatres.push(movie.data)
      }
      if (movie.data && movie.data.torrents && movie.data.torrents.length) {
        movies.canBeDownloaded.push(movie.data)
      }
      if (movie.data && !movie.data.in_theatres && (!movie.data.torrents || !movie.data.torrents.length)) {
        movies.others.push(movie.data)
      }
    })

    return movies
  }
}

const actions = {
  loadMovie ({ commit }, { tmdbId }) {
    tmdbId = +tmdbId
    commit('MOVIE_REQUEST', { tmdbId })
    return movieApi.get(tmdbId).then(data => {
      commit('MOVIE_REQUEST_SUCCESS', { tmdbId, movie: data.movie })
      if (!data.movie || !data.movie.torrents) {
        if (!retry[tmdbId] || retry[tmdbId] < 30) {
          retry[tmdbId] = (retry[tmdbId] || 0) + 1
          setTimeout(() => actions.loadMovie({ commit }, { tmdbId }), 5000)
        }
      }
    }).catch(error => {
      commit('MOVIE_REQUEST_ERROR', { tmdbId, error })
    })
  },

  setMovieWatchLater ({ commit }, { tmdbId }) {
    tmdbId = +tmdbId
    return movieApi.setWatchLater(tmdbId).then(res => {
      commit('SET_MOVIE_WATCH_LATER', { tmdbId })
      return res
    })
  },
  setMovieIgnored ({ commit }, { tmdbId }) {
    return movieApi.setIgnored(tmdbId).then(res => {
      tmdbId = +tmdbId
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
    const data = (state.movies[tmdbId] && state.movies[tmdbId].data) || { 'tmdb_id': tmdbId }
    Vue.set(state, 'movies', { ...state.movies, [tmdbId]: { loading: true, data }})
  },
  MOVIE_REQUEST_SUCCESS (state, { tmdbId, movie }) {
    if (movie.runtime) {
      const min = Math.round(movie.runtime % 60)
      movie.duration = Math.round(movie.runtime / 60) + 'h' + (min < 10 ? '0' : '') + min
    } else {
      movie.duration = null
    }
    Vue.set(state, 'movies', { ...state.movies, [tmdbId]: { loading: false, data: movie }})
  },
  MOVIE_REQUEST_ERROR (state, { tmdbId, error }) {
    Vue.set(state, 'movies', { ...state.movies, [tmdbId]: { loading: false, error }})
  }
}

export default { state, getters, actions, mutations }
