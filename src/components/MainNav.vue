<template>
  <nav
    class="navbar"
    role="navigation"
    aria-label="main navigation"
  >
    <div class="navbar-brand">
      <a
        class="navbar-item"
        @click="$router.push('/')"
      >
        <img
          src="../assets/logo.png"
          width="28"
          height="28"
        >
        <h4 class="title is-4">坂道握手会まとめ</h4>
      </a>
      <a
        role="button"
        class="navbar-burger burger"
        aria-label="menu"
        aria-expanded="false"
        :class="{'is-active':menuIsActive}"
        @click="menuIsActive=!menuIsActive"
      >
        <span aria-hidden="true" />
        <span aria-hidden="true" />
        <span aria-hidden="true" />
      </a>
    </div>
    <div
      class="navbar-menu"
      :class="{'is-active':menuIsActive}"
    >
      <div class="navbar-end">
        <div class="navbar-item">
          <div class="buttons">
            <a
              v-if="signnedIn"
              class="button is-light"
              @click="signOut"
            >
              ログアウト
            </a>
            <a
              v-else
              class="button is-primary is-light"
              @click="signIn"
            >
              ログイン
            </a>
          </div>
        </div>
      </div>
    </div>
  </nav>
</template>
<script>
export default {
  data () {
    return {
      menuIsActive: false
    }
  },
  computed: {
    signnedIn () {
      return this.$store.getters.signnedIn
    }
  },
  methods: {
    signIn () {
      this.$router.push('/signin')
    },
    async signOut () {
      await this.$auth.signOut()
      this.$store.dispatch('signOut')
    }
  }
}
</script>
