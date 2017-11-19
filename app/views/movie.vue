<template>
  <div class="movie">
    <div class="header" :class="{ backdrop }">
      <img :src="backdrop" v-if="backdrop">
      <div v-if="data.title_fr" class="title">
        <h4>{{ data.title_fr }} <i class="loading float-right mr-2" v-show="movie.loading"></i></h4>
        <h6 v-if="data.title_en"><img class="flag" src="/icons/flag-en.png"> {{ data.title_en }}</h6>
      </div>
      <div v-else class="title">
        <h4 v-if="data.title_en">{{ data.title_en }} <i class="loading float-right mr-2" v-show="movie.loading"></i></h4>
        <h5 v-else>TMDB #{{ tmdbId }} <i class="loading float-right mr-2" v-show="movie.loading"></i></h5>
      </div>
    </div>
    <p class="toast toast-error" v-if="movie.error">{{ movie.error }} <button class="btn btn-sm" @click="loadMovie({ tmdbId })">retry</button></p>
    <img class="poster" :src="poster" v-if="poster">
    <table class="table table-striped">
      <tbody>
        <tr v-if="watchLaterAction !== false">
          <th>Watch Later</th>
          <td>
            <button class="btn btn-sm" @click="setMovieIgnored({ tmdbId })" v-if="isInMyMovies">Remove from your movies</button>
            <button class="btn btn-sm btn-primary" @click="setMovieWatchLater({ tmdbId })" v-else>Add to your movies</button>
          </td>
        </tr>
        <tr v-if="data.original_title !== data.title_en && data.original_title !== data.title_fr">
          <th>Original title</th>
          <td>{{ data.original_title }}</td>
        </tr>
        <tr v-if="data.status">
          <th>Status</th>
          <td>{{ data.status }}</td>
        </tr>
        <tr>
          <th>Release date</th>
          <td>
            <span v-if="data.in_theatres" class="label label-success mr-2">In theatres</span>
            <span v-if="data.release_date_fr" class="mr-2"><img class="flag" src="/icons/flag-fr.png"> {{ data.release_date_fr.slice(0, 10) }}</span>
            <span v-if="data.release_date_en"><img class="flag" src="/icons/flag-en.png"> {{ data.release_date_en.slice(0, 10) }}</span>
          </td>
        </tr>
        <tr v-if="data.genres">
          <th>Genres</th>
          <td><span class="label label-primary mr-1" v-for="genre in data.genres" :key="genre">{{ genre }}</span></td>
        </tr>
        <tr v-if="data.duration">
          <th>Duration</th>
          <td>{{ data.duration }}</td>
        </tr>
        <tr v-if="data.homepage_en || data.homepage_fr">
          <th>Homepage</th>
          <td>
            <div v-if="data.homepage_fr"><a :href="data.homepage_fr" target="_blank"><img class="flag" src="/icons/flag-fr.png"> {{ data.homepage_fr }}</a></div>
            <div v-if="data.homepage_en"><a :href="data.homepage_en" target="_blank"><img class="flag" src="/icons/flag-en.png"> {{ data.homepage_en }}</a></div>
          </td>
        </tr>
        <tr>
          <th>TMDB</th>
          <td><a :href="`https://www.themoviedb.org/movie/${tmdbId}`" target="_blank"><i class="icon icon-share"></i> The Movie Database page movie</a></td>
        </tr>
      </tbody>
    </table>
    <blockquote v-if="data.overview_fr"><img class="flag" src="/icons/flag-fr.png"> {{ data.overview_fr }}</blockquote>
    <blockquote v-if="data.overview_en"><img class="flag" src="/icons/flag-en.png"> {{ data.overview_en }}</blockquote>
    <div class="clearfix"></div>
    <section class="torrents">
      <h4>Torrents</h4>
      <center v-if="!data.torrents"><i class="loading"></i></center>
      <p class="toast toast-error" v-else-if="data.torrents.length === 0">Not available for download. </p>
      <table class="table table-striped" v-else>
        <tbody>
          <tr v-for="torrent in data.torrents" :key="torrent.slug">
            <td>
              <h6><a :href="torrent.desc" target="_blank">{{ torrent.title }} <sup>[{{ torrent.provider }}]</sup></a></h6>
              <div class="columns">
                <div class="col-3">
                  <b>{{ torrent.size }}</b><br>
                  <small>SIZE</small>
                </div>
                <div class="col-3">
                  <b>{{ torrent.seeds }}</b><br>
                  <small>SEEDERS</small>
                </div>
                <div class="col-3">
                  <b>{{ torrent.peers }}</b><br>
                  <small>LEECHERS</small>
                </div>
                <div class="col-3">
                  <b><a :href="torrent.magnet">MAGNET</a></b><br>
                  <small v-if="torrent.link"><a :href="torrent.link">TORRENT</a></small>
                </div>
              </div>
            </td>
          </tr>
        </tbody>
      </table>
    </section>
    <section v-if="data.videos_fr && data.videos_fr.length">
      <h4>French videos <img class="flag" src="/icons/flag-fr.png"></h4>
      <youtube class="my-1" :youtube-id="video" v-for="video in data.videos_fr" :key="video"></youtube>
    </section>
    <section v-if="data.videos_en && data.videos_en.length">
      <h4>English videos <img class="flag" src="/icons/flag-en.png"></h4>
      <youtube class="my-1" :youtube-id="video" v-for="video in data.videos_en" :key="video"></youtube>
    </section>
  </div>
</template>

<script>
import { mapGetters, mapActions } from 'vuex'
import Youtube from './youtube.vue'

export default {
  name: 'movie',

  props: ['tmdbId', 'preData', 'watchLaterAction'],
  components: { Youtube },

  data () {
    return {
    }
  },

  computed: {
    ...mapGetters(['getMovie', 'myMoviesIds']),
    movie () {
      return this.getMovie(this.tmdbId)
    },
    isInMyMovies () {
      return this.myMoviesIds.indexOf(+this.tmdbId) !== -1
    },
    fullData () {
      if (this.movie.loading === null) {
        this.loadMovie({ tmdbId: this.tmdbId })
      }
      return this.movie.data || {}
    },
    data () {
      if (this.preData) {
        return { ...this.preData, ...this.fullData }
      }
      return this.fullData
    },
    backdrop () {
      return this.data.backdrop_fr || this.data.backdrop_en || null
    },
    poster () {
      return this.data.poster_fr || this.data.poster_en || null
    }
  },

  methods: {
    ...mapActions(['loadMovie', 'setMovieWatchLater', 'setMovieIgnored'])
  }
}
</script>

<style lang="scss">
.movie {
  margin: 1rem 0;

  .header.backdrop {
    max-height: 17rem;
    overflow: hidden;
    margin-bottom: 1rem;
    opacity: 0.9;
    position: relative;
    box-shadow: 1px 1px 2px #444444;

    > img {
      width: 100%;
    }

    .title {
      background: rgba(44, 44, 44, .7);
      padding: .5rem 1rem;
      color: white;
      position: absolute;
      bottom: 0;
      left: 0;
      width: 100%;
    }
  }

  .poster {
    float: right;
    width: 15rem;
    max-width: 100%;
    box-shadow: 3px 3px 6px #444444;
    margin-left: 1rem;
    margin-bottom: 1rem;
  }

  > table {
    width: calc(100% - 16rem);
  }

  > section {
    margin: 2rem 0;

    h4 {
      margin: 1rem 0;
    }
  }

  .torrents .columns {
    text-align: center;
    line-height: .5rem;
    font-size: 80%;
  }

  @media screen and (max-width: 1200px) {
    .poster {
      width: 6rem;
    }

    > table {
      width: calc(100% - 7rem);
    }
  }

  @media screen and (max-width: 600px) {
    .poster {
      float: none;
      width: 100%;
      margin-left: 0;
    }

    > table {
      width: 100%;
    }
  }
}
</style>
