import Vue from 'vue'
import Vuex from 'vuex'
import firebase from 'firebase'
import { firestore } from './firebaseConfig'
import { aggregateEntry } from './utils/FortuneAggregator'
import { compareDateStr } from './utils/DateStrComparer'

Vue.use(Vuex)

let unsubscribe

const replacer = (key, value) => {
  if (key === 'updatedAt') {
    return value.toMillis()
  }
  return value
}

const reviver = (key, value) => {
  if (key === 'updatedAt') {
    return firebase.firestore.Timestamp.fromMillis(value)
  }
  return value
}

const store = new Vuex.Store({
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
    loadCache (state) {
      if (localStorage.getItem('store')) {
        const cachedStore = JSON.parse(localStorage.getItem('store'), reviver)
        console.debug(cachedStore)

        this.replaceState(Object.assign(state, cachedStore))
      }
    },
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
    loadCache ({ commit }) {
      console.debug('loadCache')
      commit('loadCache')
    },
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

store.dispatch('loadCache')
store.subscribe((mutation, state) => {
  console.debug('saveCache')
  localStorage.setItem('store', JSON.stringify(state, replacer))
})

export default store
