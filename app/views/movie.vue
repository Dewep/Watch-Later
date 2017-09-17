<template>
  <div>
    <h5>{{ title }}</h5>
  </div>
</template>

<script>
import { mapGetters, mapActions } from 'vuex'

export default {
  name: 'movie',

  props: ['tmdbId', 'preData'],

  data () {
    return {
    }
  },

  computed: {
    ...mapGetters(['newsRequest', 'news']),
    fullData () {
      return {}
    },
    data () {
      if (this.preData) {
        return { ...this.preData, ...this.fullData }
      }
      return this.fullData
    },
    title () {
      return this.data.title_fr || this.data.title_en || `TMDB #${this.tmdbId}`
    }
  },

  methods: {
    ...mapActions(['loadNews'])
  }
}
</script>
