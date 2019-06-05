import Vue from 'vue'
import Router from 'vue-router'
import store from './store'
import Home from './views/Home.vue'
import SoldOut from './views/SoldOut.vue'
import NotFound from './views/NotFound.vue'
import SignIn from './views/SignIn.vue'

Vue.use(Router)

const router = new Router({
  mode: 'history',
  base: process.env.BASE_URL,
  routes: [
    {
      path: '/',
      name: 'home',
      meta: { requiresAuth: true },
      component: Home
    }, {
      path: '/soldout',
      name: 'soldout',
      component: SoldOut
    }, {
      path: '/signin',
      name: 'signin',
      component: SignIn
    }, {
      path: '*',
      name: 'notfound',
      component: NotFound
    }
  ]
})
router.beforeEach((to, from, next) => {
  console.debug('router.beforeEach start')

  const requiresAuth = to.matched.some(record => record.meta.requiresAuth)
  if (requiresAuth) {
    // このルートはログインされているかどうか認証が必要です。
    // もしされていないならば、ログインページにリダイレクトします。
    const signnedIn = store.state.auth.uid !== null
    if (signnedIn) {
      next()
    } else {
      next({
        path: '/signin'
      })
    }
  } else {
    next() // next() を常に呼び出すようにしてください!
  }
})
export default router
