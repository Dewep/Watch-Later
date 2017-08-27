import Vue from 'vue'
import Vuex from 'vuex'

import modules from './modules'
import plugins from './plugins'

Vue.use(Vuex)

const store = new Vuex.Store({
  modules,
  plugins,
  strict: true
})

export default store
