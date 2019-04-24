import Vue from 'vue'
import Vuex from 'vuex'
import { firestore } from './firebaseConfig'
import { aggregateEntry } from './utils/FortuneAggregator'
import { compareDateStr } from './utils/DateStrComparer'

Vue.use(Vuex)

let unsubscribe

export default new Vuex.Store({
  state: {
    auth: { uid: null },
    user: {
      fortune: {
        entryList: [],
        applyList: []
      },
      scrapingState: {}
    }
  },
  getters: {
    myEventList: state => {
      const entryList = state.user.fortune.entryList
      if (!entryList) return []

      const eventList = aggregateEntry(entryList)
      return eventList.sort((a, b) => compareDateStr(a.eventDate, b.eventDate))
    }
  },
  mutations: {
    clear (state) {
      state.auth = { uid: null }
      state.user = {
        fortune: {
          entryList: [],
          applyList: []
        },
        scrapingState: {}
      }
    },
    setUser (state, payload) {
      console.debug('commit:setUser')
      state.user = payload
    },
    setAuth (state, payload) {
      console.debug('commit:setAuth')
      state.auth = payload
    }
  },
  actions: {
    signIn ({ commit }, auth) {
      commit('setAuth', auth)
      // 2重でsubscribeされるのを防ぐ
      if (unsubscribe != null) {
        unsubscribe()
      }
      unsubscribe = firestore.collection('users')
        .doc(auth.uid)
        .onSnapshot(snapshot => {
          console.debug(snapshot)
          const user = snapshot.data()
          if (user == null) { return }

          commit('setUser', user)
        })
    },
    signOut ({ commit }) {
      commit('clear')
      if (unsubscribe != null) {
        unsubscribe()
      }
    }
  }
})
