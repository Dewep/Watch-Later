<template>
  <div id="my-movies">
    <div id="my-movies-theatres" class="container">
      <h3 class="s-title">My movies in theatres <i class="loading float-right mr-2" v-if="myMovies.isLoading"></i></h3>
    </div>
    <p class="toast" v-if="myMovies.inTheatres.length === 0">None of your watched movies are currently in the theatres.</p>
    <div class="my-2" v-for="movie in myMovies.inTheatres" :key="movie.tmdb_id" v-else>
      <img class="poster" :src="movie.poster_fr" v-if="movie.poster_fr">
      <img class="poster" :src="movie.poster_en" v-else-if="movie.poster_en">
      <h5>
        <router-link :to="{ name: 'movie', params: { 'tmdbId': movie.tmdb_id }}">
          <span v-if="movie.title_fr">{{ movie.title_fr }}</span>
          <span v-else-if="movie.title_en">{{ movie.title_en }}</span>
          <span v-else>TMDB #{{ movie.tmdb_id }}</span>
        </router-link>
      </h5>
      <div class="clearfix"></div>
    </div>
    <div id="my-movies-dl" class="container">
      <h3 class="s-title">My movies that can be downloaded <i class="loading float-right mr-2" v-if="myMovies.isLoading"></i></h3>
    </div>
    <p class="toast">None of your watched movies can currently be downloaded.</p>
    <div id="my-movies-others" class="container">
      <h3 class="s-title">My other watched movies <i class="loading float-right mr-2" v-if="myMovies.isLoading"></i></h3>
    </div>
    <p class="toast" v-if="myMovies.others.length === 0">You currently have no other watched later movies.</p>
    <div class="my-2" v-for="movie in myMovies.others" :key="movie.tmdb_id" v-else>
      <img class="poster" :src="movie.poster_fr" v-if="movie.poster_fr">
      <img class="poster" :src="movie.poster_en" v-else-if="movie.poster_en">
      <h5>
        <router-link :to="{ name: 'movie', params: { 'tmdbId': movie.tmdb_id }}">
          <span v-if="movie.title_fr">{{ movie.title_fr }}</span>
          <span v-else-if="movie.title_en">{{ movie.title_en }}</span>
          <span v-else>TMDB #{{ movie.tmdb_id }}</span>
        </router-link>
      </h5>
      <div class="clearfix"></div>
    </div>
  </div>
</template>

<script>
import { mapGetters, mapActions } from 'vuex'

export default {
  name: 'movies',

  data () {
    return {
      loading: {},
      error: {}
    }
  },

  computed: {
    ...mapGetters(['myMoviesIds', 'getMovie']),
    myMovies () {
      const movies = {
        isLoading: false,
        inTheatres: [],
        canBeDownloaded: [],
        others: []
      }

      this.myMoviesIds.forEach(tmdbId => {
        const movie = this.getMovie(tmdbId)

        if (movie.loading === null) {
          movies.isLoading = true
          this.loadMovie({ tmdbId })
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
  },

  methods: {
    ...mapActions(['setMovieIgnored', 'loadMovie'])
  }
}
</script>
