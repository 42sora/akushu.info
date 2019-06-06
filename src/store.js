import Vue from 'vue'
import Vuex from 'vuex'
import firebase from 'firebase'
import { firestore } from './firebaseConfig'
import { aggregateEntry } from './utils/FortuneAggregator'
import { compareDateStr } from './utils/DateStrComparer'

Vue.use(Vuex)

let unsubscribe

const replacer = (key, value) => {
  // convert firestore Timestamp
  if (key === 'updatedAt') {
    return value.toMillis()
  }
  return value
}

const reviver = (key, value) => {
  // convert firestore Timestamp
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
    },
    public: {
      sortKey: {
        goods: []
      },
      goodsList: {}
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
    },
    setPublic (state, payload) {
      console.debug('commit:setPublic')
      state.public = payload
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

// cache
if (localStorage.getItem('store')) {
  console.debug('Cache:load')
  const cachedStore = JSON.parse(localStorage.getItem('store'), reviver)
  console.debug(cachedStore)
  store.replaceState(Object.assign(store.state, cachedStore))
}
store.subscribe((mutation, state) => {
  console.debug('Cache:save')
  localStorage.setItem('store', JSON.stringify(state, replacer))
})

// subscribe public collection
firestore.collection('public').onSnapshot(snapshot => {
  const data = snapshot.docs.reduce((obj, doc) => {
    obj[doc.id] = doc.data()
    return obj
  }, {})
  // Firestore can not nest arrays
  // convert objects of key is number to an array
  if (data.hasOwnProperty('goodsList')) {
    for (const events of Object.values(data.goodsList)) {
      for (const event of events) {
        for (const detail of event.details) {
          const statusArray = []
          for (const key of Object.keys(detail.status)) {
            statusArray[key] = detail.status[key]
          }
          detail.status = statusArray
        }
      }
    }
  }
  store.commit('setPublic', data)
})

export default store
