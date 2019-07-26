<template>
  <div class="SignIn">
    <div id="firebaseui-auth-container" />
    <div v-show="isLoading">
      Loading...
    </div>
  </div>
</template>

<script>
import firebase from 'firebase/app'
import firebaseui from 'firebaseui-ja'

export default {
  name: 'SignIn',
  components: { },
  data: function () {
    return { isLoading: true }
  },
  mounted () {
    let ui = firebaseui.auth.AuthUI.getInstance()
    if (!ui) { ui = new firebaseui.auth.AuthUI(this.$auth) }
    ui.start('#firebaseui-auth-container', {
      callbacks: {
        signInSuccessWithAuthResult: (authResult, redirectUrl) => {
          this.$store.dispatch('signIn', authResult.user)
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
        firebase.auth.TwitterAuthProvider.PROVIDER_ID,
        firebaseui.auth.AnonymousAuthProvider.PROVIDER_ID
      ],
      tosUrl: '<your-tos-url>',
      privacyPolicyUrl: '<your-privacy-policy-url>'
    })
  }
}
</script>
