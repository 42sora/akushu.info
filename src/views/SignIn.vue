<template>
  <div class="SignIn">
    <div id="firebaseui-auth-container" />
    <div v-show="isLoading">
      Loading...
    </div>
  </div>
</template>

<script>
import firebase from 'firebase'
import firebaseui from 'firebaseui-ja'

export default {
  name: 'SignIn',
  components: { },
  data: function () {
    return { isLoading: true }
  },
  created () {
    const unsubscribe = this.$auth.onAuthStateChanged((user) => {
      if (user) {
        this.$store.commit('signIn', { user: user })
        this.$router.push('/')
      }
    })
    this.$once('hook:beforeDestroy', () => {
      unsubscribe()
    })
  },
  mounted () {
    let ui = firebaseui.auth.AuthUI.getInstance()
    if (!ui) { ui = new firebaseui.auth.AuthUI(this.$auth) }
    ui.start('#firebaseui-auth-container', {
      callbacks: {
        signInSuccessWithAuthResult: (authResult, redirectUrl) => {
          this.$store.commit('signIn', { user: authResult.user })
          this.$router.push('/')
          return false
        },
        uiShown: () => {
          this.isLoading = false
        }
      },
      signInFlow: 'redirect',
      signInOptions: [
        firebase.auth.GoogleAuthProvider.PROVIDER_ID,
        firebaseui.auth.AnonymousAuthProvider.PROVIDER_ID
      ],
      tosUrl: '<your-tos-url>',
      privacyPolicyUrl: '<your-privacy-policy-url>'
    })
  }
}
</script>
<style>
</style>
