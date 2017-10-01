import Vue from 'vue'
import movieApi from '../../api/movie'

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

      if (movie.data && movie.data.isInTheatres) {
        movies.isInTheatres.push(movie.data)
      }
      if (movie.data && movie.data.canBeDownloaded) {
        movies.canBeDownloaded.push(movie.data)
      }
      if (movie.data && (!movie.data.isInTheatres || !movie.data.canBeDownloaded)) {
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
    Vue.set(state, 'movies', { ...state.movies, [tmdbId]: { loading: true }})
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
