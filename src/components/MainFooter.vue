<template>
  <footer class="footer">
    <div class="level is-mobile">
      <div
        class="level-item"
        @click="toSoldOut"
      >
        <div class="icon is-large">
          <font-awesome-icon
            icon="table"
            size="3x"
          />
        </div>
      </div>
      <div
        class="level-item"
        @click="toHome"
      >
        <span class="icon is-large">
          <font-awesome-icon
            icon="user"
            size="3x"
          />
        </span>
      </div>
    </div>
  </footer>
</template>
<script>
export default {
  data () {
    return {

    }
  },
  methods: {
    toSoldOut () {
      this.$router.push('/soldout')
    },
    toHome () {
      this.$router.push('/')
    }
  }
}
</script>
<style scoped>
footer{
  width: 100vw;
  background-color: lavenderblush;
  padding: 12px 24px;
  z-index: 100;
}
</style>
