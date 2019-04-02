import Vue from 'vue'
import store from './store'
import firebase from 'firebase'

const config = {
  apiKey: 'AIzaSyC3PWmSiMDYHviFrbYDbK0aJaLSY3amEHE',
  authDomain: 'akuu-37e4b.firebaseapp.com',
  databaseURL: 'https://akuu-37e4b.firebaseio.com',
  projectId: 'akuu-37e4b',
  storageBucket: 'akuu-37e4b.appspot.com',
  messagingSenderId: '975614918299'
}
firebase.initializeApp(config)

Vue.prototype.$firestore = firebase.firestore()
Vue.prototype.$functions = firebase.app().functions('asia-northeast1')
const auth = firebase.auth()
Vue.prototype.$auth = auth

// ここに書くのは適切ではない気がする
auth.onAuthStateChanged((user) => {
  console.log(user)
  if (user) {
    store.commit('signIn', {
      user: {
        uid: user.uid
      }
    })
  } else {
    store.commit('signOut')
  }
})
