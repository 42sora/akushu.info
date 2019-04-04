<template>
  <form @submit.prevent="login">
    <p class="content">
      forTUNE musicの注文履歴から握手券購入枚数を取得します。
    </p>
    <div class="field">
      <label class="label">メールアドレス</label>
      <div class="control">
        <input
          v-model="email"
          class="input"
          type="email"
          placeholder="forTUNE musicでのメールアドレス"
          autocomplete="email"
          :class="{'is-danger':!isValidEmail}"
        >
      </div>
      <p
        v-if="!isValidEmail"
        class="help is-danger"
      >
        メールアドレスの形式が誤っています。
      </p>
    </div>
    <div class="field">
      <label class="label">パスワード</label>
      <div class="control">
        <input
          v-model="password"
          class="input"
          type="password"
          placeholder="forTUNE musicでのパスワード"
          autocomplete="current-password"
          :class="{'is-danger':!isValidPassword}"
        >
      </div>
      <p
        v-if="!isValidPassword"
        class="help is-danger"
      >
        8～12文字の半角英数字で入力してください。
      </p>
    </div>
    <div class="field">
      <div class="control">
        <a
          class="button is-primary"
          :class="{'is-loading':isSending}"
          @click="login"
        >
          ログイン
        </a>
      </div>
    </div>
    <input
      type="submit"
      style="display:none"
    >
  </form>
</template>
<script>

/**
 * emailの形式をチェックする.
 * かなり緩くチェックする.
 * 正しい形式の場合にtrue
 */
const validEmail = email => {
  if (!email) { return false }
  return /.+@.+\..+/.test(email)
}

/**
 * passwordの形式をチェックする.
 * 8～12文字で半角英数かチェックする.
 * 正しい形式の場合にtrue
 */
const validPassword = password => {
  if (!password) { return false }
  if (password.length < 8) { return false }
  if (password.length > 12) { return false }
  return /[a-zA-Z0-9]+/.test(password)
}
export default {
  data: () => {
    return {
      email: '',
      password: '',
      isValidEmail: true,
      isValidPassword: true,
      isSending: false
    }
  },
  methods: {
    login () {
      const email = this.email
      this.isValidEmail = validEmail(email)

      const password = this.password
      this.isValidPassword = validPassword(password)

      if (!this.isValidEmail || !this.isValidPassword) { return }

      this.isSending = true

      const close = () => {
        this.email = ''
        this.password = ''
        this.isSending = false
      }
      this.$emit('login-fortune', { email, password, close })
    }
  }
}
</script>
<style>
</style>
