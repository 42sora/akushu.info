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
  computed: {
    user: function () {
      return this.$store.state.user
    }
  },
  watch: {
    user: function () {
      if (this.$store.state.user.uid) {
        this.$router.push('/')
      }
    }
  },
  mounted () {
    let ui = firebaseui.auth.AuthUI.getInstance()
    if (!ui) { ui = new firebaseui.auth.AuthUI(firebase.auth()) }
    ui.start('#firebaseui-auth-container', {
      callbacks: {
        signInSuccessWithAuthResult: (authResult, redirectUrl) => {
          return true
        },
        uiShown: () => {
          this.isLoading = false
        }
      },
      signInFlow: 'redirect',
      signInSuccessUrl: '/',
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
