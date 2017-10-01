<template>
  <div class="video-responsive youtube-preview" @click="isLoaded = true" v-if="!isLoaded">
    <img :src="`https://i.ytimg.com/vi/${youtubeId}/hqdefault.jpg`">
  </div>
  <div class="video-responsive" v-else>
    <iframe width="560" height="315" :src="`https://www.youtube.com/embed/${youtubeId}?autoplay=1`" allowfullscreen="1" frameborder="0"></iframe>
  </div>
</template>

<script>
import { mapGetters, mapActions } from 'vuex'

export default {
  name: 'movie',

  props: ['youtubeId'],

  data () {
    return {
      isLoaded: false
    }
  }
}
</script>

<style lang="scss">
.youtube-preview {
  position: relative;
  overflow: hidden;
  max-width: 100%;
  background: #111;

  img {
    bottom: 0;
    display: block;
    left: 0;
    margin: auto;
    max-width: 100%;
    width: 100%;
    position: absolute;
    right: 0;
    top: 0;
    border: none;
    height: auto;
    cursor: pointer;
    -webkit-transition: .4s all;
    -moz-transition: .4s all;
    transition: .4s all;

    &:hover {
      filter: brightness(75%);
    }
  }

  &::after {
    height: 72px;
    width: 72px;
    left: 50%;
    top: 50%;
    margin-left: -36px;
    margin-top: -36px;
    position: absolute;
    content: '';
    display: block;
    background: url("/icons/youtube-play.png") no-repeat;
    cursor: pointer;
  }
}
</style>
