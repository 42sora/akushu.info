<template>
  <div>
    <progress
      v-if="isRedirect"
      class="progress is-primary"
      max="100"
    />
    <div
      v-else
      class="container"
    >
      <div
        class="has-text-centered"
      >
        <button
          class="google button is-medium is-fullwidth is-primary"
          @click="googleLogin"
        >
          <span class="icon is-large">
            <font-awesome-icon :icon="['fab','google']" />
          </span>
          <span>
            Google でログイン
          </span>
        </button>
        <button
          class="twitter button is-medium is-fullwidth is-primary"
          @click="twitterLogin"
        >
          <span class="icon is-large">
            <font-awesome-icon :icon="['fab','twitter']" />
          </span>
          <span>
            Twitter でログイン
          </span>
        </button>
      </div>
    </div>
  </div>
</template>

<script>
import firebase from 'firebase/app'

export default {
  name: 'SignIn',
  components: { },
  data: function () {
    return { isRedirect: false }
  },
  created () {
    this.isRedirect = sessionStorage.getItem('isRedirect')
    sessionStorage.removeItem('isRedirect')

    if (this.isRedirect) {
      this.$auth.getRedirectResult().then(authResult => {
        console.debug(authResult)
        if (authResult.user !== null) {
          this.$store.dispatch('signIn', authResult.user)
          this.$router.push('/')
        } else {
          this.isRedirect = false
        }
      })
    }
  },
  methods: {
    async googleLogin () {
      const provider = new firebase.auth.GoogleAuthProvider()
      this.login(provider)
    },
    async twitterLogin () {
      const provider = new firebase.auth.TwitterAuthProvider()
      this.login(provider)
    },
    login (provider) {
      sessionStorage.setItem('isRedirect', true)
      this.$auth.signInWithRedirect(provider)
    }
  }
}
</script>
<style lang="scss" scoped>
.button {
  &.google {
    background-color: #4285f4;
  }

  &.twitter {
    background-color: #55acee;
  }

  + .button {
    margin-top: 24px;
  }
}
</style>
