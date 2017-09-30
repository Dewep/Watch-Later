<template>
  <div id="news" class="container">
    <h3 class="s-title">News <small v-if="remainingMovies"><sup>{{ remainingMovies }} movies remaining</sup></small> <i class="loading float-right mr-2" v-if="newsRequest.loading"></i></h3>
    <p class="toast toast-error" v-if="newsRequest.error">{{ newsRequest.error }}</p>
    <p class="toast" v-if="!newsRequest.loading && !movie">No more new movies. <button class="btn btn-sm" @click="loadNews({})">refresh</button></p>
    <div v-else-if="!newsRequest.loading">
      <p class="toast toast-error" v-if="actionError">{{ actionError }}</p>
      <div class="btn-group btn-group-block mt-2" :class="{ loading: actionLoading }">
        <button class="btn" @click.prevent="actionMovie(false)">Ignore this movie</button>
        <button class="btn btn-primary" @click.prevent="actionMovie(true)">I want to watch it!</button>
      </div>
      <movie :tmdb-id="movie.tmdb_id" :pre-data="movie"></movie>
      <p class="toast toast-error" v-if="actionError">{{ actionError }}</p>
      <div class="btn-group btn-group-block mt-2" :class="{ loading: actionLoading }">
        <button class="btn" @click.prevent="actionMovie(false)">Ignore this movie</button>
        <button class="btn btn-primary" @click.prevent="actionMovie(true)">I want to watch it!</button>
      </div>
    </div>
  </div>
</template>

<script>
import { mapGetters, mapActions } from 'vuex'
import Movie from './movie.vue'

export default {
  name: 'news',

  components: { Movie },

  data () {
    return {
      actionLoading: false,
      actionError: null
    }
  },

  computed: {
    ...mapGetters(['newsRequest', 'news']),
    movies () {
      if (!this.news) {
        this.loadNews({})
      }
      return this.news
    },
    remainingMovies () {
      return this.movies ? this.movies.length : 0
    },
    movie () {
      if (this.remainingMovies) {
        return this.movies[0]
      }
      return null
    }
  },

  methods: {
    ...mapActions(['loadNews', 'discardFirstNews', 'setMovieWatchLater', 'setMovieIgnored']),
    actionMovie (isWatchLater) {
      if (this.movies.length && this.movie.tmdb_id) {
        this.actionLoading = true
        this.actionError = null
        const fct = isWatchLater ? this.setMovieWatchLater : this.setMovieIgnored
        fct({ tmdbId: this.movie.tmdb_id }).then(() => {
          this.discardFirstNews()
          this.actionLoading = false
        }).catch(error => {
          this.actionLoading = false
          this.actionError = error
        })
      }
    }
  }
}
</script>
