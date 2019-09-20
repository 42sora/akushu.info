import Vue from 'vue'
import firebase from 'firebase/app'
import 'firebase/auth'
import 'firebase/firestore'
import 'firebase/functions'
import 'firebase/performance'

const config = {
  apiKey: process.env.VUE_APP_API_KEY,
  authDomain: 'akuu-37e4b.firebaseapp.com',
  databaseURL: 'https://akuu-37e4b.firebaseio.com',
  projectId: 'akuu-37e4b',
  storageBucket: 'akuu-37e4b.appspot.com',
  messagingSenderId: '975614918299',
  appId: '1:975614918299:web:4fd4d28005769fc1'
}
firebase.initializeApp(config)

export const firestore = firebase.firestore()
// extend prototype of Vue
Vue.prototype.$firestore = firestore
Vue.prototype.$functions = firebase.app().functions('asia-northeast1')
Vue.prototype.$auth = firebase.auth()
Vue.prototype.$performance = firebase.performance()
