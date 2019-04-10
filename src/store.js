import Vue from 'vue'
import Vuex from 'vuex'
import { compareDateStr } from './utils/DateStrComparer'

Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    user: { uid: null },
    fortune: []
  },
  mutations: {
    setFortune (state, fortune) {
      state.fortune = fortune.sort((a, b) => compareDateStr(a.eventDate, b.eventDate))
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
