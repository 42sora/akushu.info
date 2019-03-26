import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    user: { uid: null },
    fortune: []
  },
  mutations: {
    setFortune (state, fortune) {
      state.fortune = fortune
    },
    signIn (state, payload) {
      console.log('commit:signIn')
      state.user = payload.user
    },
    signOut (state) {
      console.log('commit:signOut')
      state.user = { uid: null }
    }
  },
  actions: {}
})
