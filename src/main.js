import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import './registerServiceWorker'
import './firebaseConfig'
import './fortawesomeConfig'

Vue.config.productionTip = false
Vue.config.performance = process.env.NODE_ENV !== 'production'

new Vue({
  router,
  store,
  beforeCreate () {
    this.$auth.onAuthStateChanged((auth) => {
      if (auth != null) {
        this.$store.dispatch('signIn', auth)
      } else {
        this.$store.dispatch('signOut', auth)
      }
    })
  },
  render: h => h(App)
}).$mount('#app')
