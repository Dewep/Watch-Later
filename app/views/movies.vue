<template>
  <div id="my-movies">
    <div v-for="section in sections" :key="section.key" class="my-2">
      <div :id="`my-movies-${section.key}`" class="container">
        <h3 class="s-title">{{ section.title }} <i class="loading float-right mr-2" v-if="movies.isLoading"></i></h3>
      </div>
      <p class="toast" v-if="movies[section.key].length === 0">{{ section.emptyMessage }}</p>
      <div class="tile" v-for="movie in movies[section.key]" :key="movie.tmdb_id" v-else>
        <div class="tile-icon" v-if="movie.poster_fr || movie.poster_en">
          <router-link :to="{ name: 'movie', params: { 'tmdbId': movie.tmdb_id }}">
            <img :src="movie.poster_fr" v-if="movie.poster_fr">
            <img :src="movie.poster_en" v-else>
          </router-link>
        </div>
        <div class="tile-content">
          <h5 class="tile-title">
            <router-link :to="{ name: 'movie', params: { 'tmdbId': movie.tmdb_id }}">
              <span v-if="movie.title_fr">{{ movie.title_fr }}</span>
              <span v-else-if="movie.title_en">{{ movie.title_en }}</span>
              <span v-else>TMDB #{{ movie.tmdb_id }}</span>
            </router-link>
          </h5>
          <p class="tile-subtitle text-gray">
            <span class="label label-primar mr-2" v-if="movie.status">{{ movie.status }}</span>
            <span v-if="movie.release_date_fr" class="mr-2"><img class="flag" src="/icons/flag-fr.png"> {{ movie.release_date_fr.slice(0, 10) }}</span>
            <span v-if="movie.release_date_en" class="mr-2"><img class="flag" src="/icons/flag-en.png"> {{ movie.release_date_en.slice(0, 10) }}</span>
          </p>
          <p class="tile-subtitle text-gray">
            <span v-if="movie.duration" class="mr-2">{{ movie.duration }}</span>
            <span class="label label-primar mr-1" v-for="genre in movie.genres" :key="genre">{{ genre }}</span>
          </p>
        </div>
        <div class="tile-action">
          <router-link class="btn btn-sm btn-primary mb-1" :to="{ name: 'movie', params: { 'tmdbId': movie.tmdb_id }}">More info</router-link><br>
          <button class="btn btn-sm" @click="setMovieIgnored({ tmdbId: movie.tmdb_id })">Remove</button>
        </div>
      </div>
    </div>
    <div class="my-2">
      <div :id="`my-movies-add`" class="container">
        <h3 class="s-title">View another movie <small><a href="https://www.themoviedb.org/movie" target="_blank">The Movie DB</a></small></h3>
      </div>
      <p class="toast">To add a movie on your Watch-Later account, set its <a href="https://www.themoviedb.org/movie" target="_blank">The Movie DB identifier</a> retrievable in the URL (e.g. <kbd>themoviedb.org/movie/<code>315635</code>-spider-man-homecoming</kbd>):</p>
      <form @submit.prevent="viewMovie()">
        <div class="input-group">
          <span class="input-group-addon">themoviedb.org/movie/</span>
          <input type="number" class="form-input" v-model.number="tmdbId" placeholder="TMDB ID" pattern="^[0-9]+$">
          <button class="btn btn-primary input-group-btn" type="submit">View movie</button>
        </div>
      </form>
    </div>
    <div class="my-2">
      <div :id="`my-movies-add`" class="container">
        <h3 class="s-title">My ignored movies</h3>
      </div>
      <router-link class="btn btn-sm btn-primary m-1" :to="{ name: 'movie', params: { 'tmdbId': tmdbId }}" v-for="tmdbId in user.ignored" :key="tmdbId">#{{ tmdbId }}</router-link>
    </div>
    <br><br><br>
  </div>
</template>

<script>
import { mapGetters, mapActions } from 'vuex'

export default {
  name: 'movies',

  data () {
    return {
      sections: [
        {
          key: 'inTheatres',
          title: 'My movies in theatres',
          emptyMessage: 'None of your watched movies are currently in the theatres.'
        },
        {
          key: 'canBeDownloaded',
          title: 'My movies that can be downloaded',
          emptyMessage: 'None of your watched movies can currently be downloaded.'
        },
        {
          key: 'others',
          title: 'My other watched movies',
          emptyMessage: 'You currently have no other watched later movies.'
        }
      ],
      loading: {},
      error: {},
      tmdbId: ''
    }
  },

  computed: {
    ...mapGetters(['myMovies', 'user']),
    movies () {
      const movies = this.myMovies
      movies.toLoad.forEach(tmdbId => this.loadMovie({ tmdbId }))
      return movies
    }
  },

  methods: {
    ...mapActions(['setMovieIgnored', 'loadMovie']),
    viewMovie () {
      if (this.tmdbId) {
        this.$router.push({ name: 'movie', params: { tmdbId: this.tmdbId }})
      }
    }
  }
}
</script>

<style lang="scss">
#my-movies {
  .tile {
    margin-bottom: 1rem;
    border-bottom: 1px solid #EEE;
    padding-bottom: .5rem;

    .tile-icon {
      width: 2.2rem;

      a {
        display: block;

        img {
          max-width: 100%;
          margin: auto;
          box-shadow: 1px 1px 2px #444444;
        }
      }
    }

    .tile-content {
      p.tile-subtitle {
        margin-bottom: 0.2rem;
      }
    }

    .tile-action {
      margin-top: 0.3rem;
      text-align: center;
    }
  }
}
</style>
