import Vue from 'vue'
import Router from 'vue-router'

import MainComponent from '../views/main.vue'
import AuthComponent from '../views/auth.vue'
import ProfileComponent from '../views/profile.vue'
import NewsComponent from '../views/news.vue'
import MoviesComponent from '../views/movies.vue'

Vue.use(Router)

export default new Router({
  linkActiveClass: 'active',
  routes: [
    { name: 'auth', path: '/auth', component: AuthComponent },
    {
      path: '',
      component: MainComponent,
      children: [
        { name: 'home', path: '', redirect: 'news' },
        { name: 'profile', path: '/profile', component: ProfileComponent },
        { name: 'news', path: '/news', component: NewsComponent },
        { name: 'movies', path: '/movies', component: MoviesComponent }
      ]
    },
    {
      path: '*',
      redirect: '/'
    }
  ]
})
