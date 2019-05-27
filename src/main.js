import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import './registerServiceWorker'
import './firebaseConfig'
import './fortawesomeConfig'

Vue.config.productionTip = false

new Vue({
  router,
  store,
  beforeCreate () {
    this.$auth.onAuthStateChanged((auth) => {
      if (auth != null) {
        this.$store.dispatch('signIn', auth)
        this.$router.push('/')
      } else {
        this.$store.dispatch('signOut', auth)
        this.$router.push('/signin')
      }
    })
  },
  render: h => h(App)
}).$mount('#app')
