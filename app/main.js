import Vue from 'vue'
import VueResource from 'vue-resource'
import 'vueify/lib/insert-css'
import 'babel-runtime/helpers/extends'

import router from './router'
import store from './store'
import App from './views/app.vue'

Vue.use(VueResource)

const app = new Vue({
  router,
  store,
  render: h => h(App)
})

router.onReady(() => {
  app.$mount('#app')
})
