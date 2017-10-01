import store from '../store'

export default {
  notConnected (to, from, next) {
    if (store.getters.user) {
      next({ name: 'home' })
    } else {
      next()
    }
  },

  connected (to, from, next) {
    if (store.getters.user) {
      next()
    } else {
      window.wantedConnectedRoute = { path: to.path }
      next({ name: 'auth' })
    }
  },

  admin (to, from, next) {
    if (!store.getters.user) {
      window.wantedConnectedRoute = { path: to.path }
      next({ name: 'auth' })
    } else if (!store.getters.user.isAdmin) {
      next({ name: 'home' })
    } else {
      next()
    }
  }
}
