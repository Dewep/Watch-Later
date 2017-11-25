<template>
  <div id="profile" class="container">
    <h3 class="s-title">My profile</h3>
    <form class="form-horizontal" @submit.prevent="updateUserAction()">
      <div class="form-group">
        <div class="col-3 col-mr-auto">
          <label class="form-label" for="admin-user-name">Your name:</label>
        </div>
        <div class="col-8">
          <input class="form-input" id="admin-user-name" type="text" v-model="name" placeholder="Name of the new account" required>
        </div>
      </div>
      <div class="form-group">
        <div class="col-3 col-mr-auto">
          <label class="form-label" for="admin-user-email">Your email:</label>
        </div>
        <div class="col-8">
          <input class="form-input" id="admin-user-email" type="email" :value="user.email" disabled>
        </div>
      </div>
      <div class="form-group">
        <div class="col-3 col-mr-auto">
          <label class="form-label" for="admin-user-admin">I only want to see movie with at least one of these genres:</label>
        </div>
        <div class="col-8">
          <label class="form-checkbox" v-for="genre in allGenres" :key="genre.value">
            <input type="checkbox" v-model="genres" :value="genre.value">
            <i class="form-icon"></i> {{ genre.name }}
          </label>
        </div>
      </div>
      <div class="form-group">
        <div class="col-3 col-mr-auto">
          <label class="form-label" for="admin-user-admin">But I don't want to see the movies with at least one of these genres (even if the movie matchs with your genres):</label>
        </div>
        <div class="col-8">
          <label class="form-checkbox" v-for="genre in excludeGenresList" :key="genre.value">
            <input type="checkbox" v-model="excludeGenres" :value="genre.value">
            <i class="form-icon"></i> {{ genre.name }}
          </label>
        </div>
      </div>
      <div class="form-group">
        <div class="col-3 col-mr-auto">
          <label class="form-label" for="admin-user-admin">Notifications (email):</label>
        </div>
        <div class="col-8">
          <div>
            <label class="form-switch">
              <input type="checkbox" v-model="notificationsNews">
              <i class="form-icon"></i> New movies that match my genres
            </label>
          </div>
          <div>
            <label class="form-switch">
              <input type="checkbox" v-model="notificationsMovieChanges">
              <i class="form-icon"></i> On updates on my watched movies
            </label>
          </div>
          <div>
            <label class="form-switch">
              <input type="checkbox" v-model="notificationsMovieInTheatres">
              <i class="form-icon"></i> My watched movies are in theatres
            </label>
          </div>
          <div>
            <label class="form-switch">
              <input type="checkbox" v-model="notificationsMovieTorrents">
              <i class="form-icon"></i> My watched movies are available in torrents
            </label>
          </div>
        </div>
      </div>
      <div class="form-group">
        <div class="col-3 col-mr-auto"></div>
        <div class="col-8">
          <button class="btn btn-primary" type="submit" :class="{ loading }">Update</button>
        </div>
      </div>
    </form>
  </div>
</template>

<script>
import { mapGetters, mapActions } from 'vuex'

export default {
  name: 'profile',

  data () {
    return {
      name: '',
      genres: [],
      excludeGenres: [],
      notificationsNews: true,
      notificationsMovieChanges: true,
      notificationsMovieInTheatres: true,
      notificationsMovieTorrents: true,
      allGenres: [
        { name: 'Action', value: 28 },
        { name: 'Adventure', value: 12 },
        { name: 'Animation', value: 16 },
        { name: 'Comedy', value: 35 },
        { name: 'Crime', value: 80 },
        { name: 'Documentary', value: 99 },
        { name: 'Drama', value: 18 },
        { name: 'Family', value: 10751 },
        { name: 'Fantasy', value: 14 },
        { name: 'History', value: 36 },
        { name: 'Horror', value: 27 },
        { name: 'Music', value: 10402 },
        { name: 'Mystery', value: 9648 },
        { name: 'Romance', value: 10749 },
        { name: 'Science Fiction', value: 878 },
        { name: 'TV Movie', value: 10770 },
        { name: 'Thriller', value: 53 },
        { name: 'War', value: 10752 },
        { name: 'Western', value: 37 }
      ]
    }
  },

  computed: {
    ...mapGetters(['user']),
    excludeGenresList () {
      return this.allGenres.filter(genre => this.genres.indexOf(genre.value) === -1)
    }
  },

  methods: {
    ...mapActions(['updateProfile']),
    updateUserAction () {
      if (this.loading) {
        return
      }
      const data = {
        name: this.name || user.name || 'Unknown',
        genres: this.genres || [],
        excludeGenres: this.excludeGenres || [],
        notifications: {
          news: this.notificationsNews || false,
          movieChanges: this.notificationsMovieChanges || false,
          movieInTheatres: this.notificationsMovieInTheatres || false,
          movieTorrents: this.notificationsMovieTorrents || false
        }
      }
      this.loading = true
      this.error = null
      this.updateProfile(data).then(() => {
        this.loading = false
      }).catch(err => {
        this.loading = false
        this.error = err
      })
    }
  },

  watch: {
    user: {
      immediate: true,
      handler: function (user) {
        if (user) {
          this.name = user.name
          this.genres = user.genres
          this.excludeGenres = user.excludeGenres || []
          this.notificationsNews = user.notifications.news
          this.notificationsMovieChanges = user.notifications.movieChanges
          this.notificationsMovieInTheatres = user.notifications.movieInTheatres
          this.notificationsMovieTorrents = user.notifications.movieTorrents
        }
      }
    }
  }
}
</script>
