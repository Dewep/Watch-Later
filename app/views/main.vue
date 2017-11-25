<template>
  <div class="s-container container">
    <div class="columns">
      <div id="sidebar" class="s-sidebar" :class="{ open: sidebar }">
        <div class="s-brand">
          <router-link to="home" class="s-logo tooltip tooltip-bottom" data-tooltip="github.com/Dewep/Watch-Later" @click.native="sidebar = false">
            <img src="/icons/favicon-96x96.png" alt="logo" />
            <h2>Watch-Later<br><small v-if="user"><sup>{{ user.email }}</sup></small></h2>
          </router-link>
        </div>
        <div class="s-nav">
          <ul class="menu menu-nav">
            <li class="menu-item">
              <router-link :to="{ name: 'news' }" @click.native="sidebar = false">News</router-link>
            </li>
            <li class="menu-item">
              <router-link :to="{ name: 'movies' }" @click.native="sidebar = false">My movies</router-link>
            </li>
            <li class="menu-item">
              <router-link :to="{ name: 'profile' }" @click.native="sidebar = false">My profile</router-link>
            </li>
            <li class="menu-item" v-if="user.isAdmin">
              <router-link :to="{ name: 'admin' }" @click.native="sidebar = false">Administration</router-link>
            </li>
          </ul>
        </div>
      </div>
      <a href="#sidebar-close" @click.prevent="sidebar = false" id="sidebar-close" class="docs-nav-clear"></a>
      <div class="s-navbar">
        <div class="menu-btn">
          <a href="#sidebar" @click.prevent="sidebar = true" class="btn btn-link btn-action">
            <i class="icon icon-menu"></i>
          </a>
        </div>
        <div class="float-btn">
          <a href="https://github.com/Dewep/Watch-Later" target="_blank" class="btn btn-primary">GitHub</a>
        </div>
      </div>
      <div id="content" class="s-content">
        <router-view></router-view>
      </div>
    </div>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import guards from '../router/guards'

export default {
  name: 'main',

  beforeRouteEnter: guards.connected,
  beforeRouteUpdate: guards.connected,

  data () {
    return {
      sidebar: false
    }
  },

  computed: mapGetters(['user']),

  watch: {
    user (newUser) {
      if (newUser) {
        this.$router.push({ name: 'home' })
      }
    }
  }
}
</script>
