import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    fortune: []
  },
  mutations: {
    setFortune (state, fortune) {
      state.fortune = fortune
    }
  },
  actions: {}
})
