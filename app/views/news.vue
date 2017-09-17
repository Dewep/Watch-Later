<template>
  <div id="news" class="container">
    <h3 class="s-title">News <small v-if="remainingMovies"><sup>{{ remainingMovies }} movies remaining</sup></small></h3>
    <p class="toast toast-error" v-if="newsRequest.error">{{ newsRequest.error }}</p>
    <p class="toast" v-if="newsRequest.loading">Loading... <i class="loading"></i></p>
    <p class="toast" v-else-if="!movie">No more new movies. <button class="btn btn-sm" @click="loadNews({})">Refresh</button></p>
    <div v-else>
      <movie :tmdb-id="movie.tmdb_id" :pre-data="movie"></movie>
      <div class="btn-group btn-group-block mt-2">
        <button class="btn">Ignore this movie</button>
        <button class="btn btn-primary">I want to watch it!</button>
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
    ...mapActions(['loadNews'])
  }
}
</script>
