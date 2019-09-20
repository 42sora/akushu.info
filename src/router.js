import Vue from 'vue'
import Router from 'vue-router'
import store from './store'
import Home from './views/Home.vue'
import SoldOut from './views/SoldOut.vue'
import OfficialSchedule from './views/OfficialSchedule.vue'
import Share from './views/Share.vue'
import NotFound from './views/NotFound.vue'

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
      path: '/schedule',
      name: 'schedule',
      component: OfficialSchedule
    }, {
      path: '/signin',
      name: 'signin',
      component: () => import(/* webpackChunkName: "signin" */'./views/SignIn')
    }, {
      path: '/share',
      name: 'share',
      component: Share
    }, {
      path: '*',
      name: 'notfound',
      component: NotFound
    }
  ],
  scrollBehavior (to, from, savedPosition) {
    return { x: 0, y: 0 }
  }
})
router.beforeEach((to, from, next) => {
  console.debug('router.beforeEach start')

  const requiresAuth = to.matched.some(record => record.meta.requiresAuth)
  if (requiresAuth) {
    // このルートはログインされているかどうか認証が必要です。
    // もしされていないならば、ログインページにリダイレクトします。
    const signnedIn = store.getters.signnedIn
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
