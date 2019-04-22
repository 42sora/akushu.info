<template>
  <div class="content">
    <template v-if="isWaiting">
      <progress
        class="progress is-primary"
        max="100"
      />
      <p class="has-text-info">
        データ取得準備中です。（バックグラウンドでも動作します）<br>
        データ取得完了までお待ちください。<br>
        完了まで数分から15分程度かかります。
      </p>
    </template>
    <template v-else-if="isExecuting">
      <progress
        class="progress is-primary"
        max="100"
      />
      <p class="has-text-info">
        データ取得中です。（バックグラウンドでも動作します）<br>
        データ取得完了までお待ちください。<br>
        完了まで数分から15分程度かかります。
      </p>
    </template>
    <template v-else-if="isCompleted">
      <p class="has-text-success">
        データ取得が完了しました。
      </p>
    </template>
    <template v-else-if="isLoginFailed">
      <p class="has-text-danger">
        forTUNE musicへのログインに失敗しました。<br>
        forTUNE musicにて以下のメッセージが表示されています。
      </p>
      <article class="message is-danger">
        <div class="message-body">
          <p
            v-for="message in errorMessage.split('\n')"
            :key="message"
          >
            {{ message }}
          </p>
        </div>
      </article>
    </template>
    <template v-else-if="isSystemError">
      <p class="has-text-danger">
        エラーが発生しました。<br>
        お手数ですが、もう一度やり直してください。
      </p>
    </template>
  </div>
</template>

<script>
export default {
  props: {
    scrapingState: { type: Object, required: true }
  },
  computed: {
    isWaiting () {
      return this.scrapingState.state === 'WAITING'
    },
    isExecuting () {
      return this.scrapingState.state === 'EXECUTING'
    },
    isCompleted () {
      return this.scrapingState.state === 'COMPLETED'
    },
    isLoginFailed () {
      return this.scrapingState.state === 'LOGIN_FAILED'
    },
    isSystemError () {
      return this.scrapingState.state === 'SYSTEM_ERROR'
    },
    errorMessage () {
      return this.scrapingState.errorMessage
    }
  }
}
</script>
<style>
</style>
