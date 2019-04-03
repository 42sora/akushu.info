import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import './registerServiceWorker'
import './firebaseConfig'

Vue.config.productionTip = false

import(/* webpackChunkName: "fontawesome" */'@fortawesome/fontawesome-free/js/all')

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')
