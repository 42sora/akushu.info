import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

const compareDateStr = (a, b) => {
  if (a === b) { return 0 }
  const splitedA = a.split('-').map(x => parseInt(x, 10))
  const splitedB = b.split('-').map(x => parseInt(x, 10))
  if (splitedA[0] < splitedB[0] ||
  (splitedA[0] === splitedB[0] && splitedA[1] < splitedB[1]) ||
  (splitedA[0] === splitedB[0] && splitedA[1] === splitedB[1] && splitedA[2] < splitedB[2])) {
    return -1
  } else {
    return 1
  }
}

export default new Vuex.Store({
  state: {
    user: { uid: null },
    fortune: []
  },
  mutations: {
    setFortune (state, fortune) {
      state.fortune = fortune
        .sort((a, b) => compareDateStr(a.eventDate, b.eventDate))
        .reverse()
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
