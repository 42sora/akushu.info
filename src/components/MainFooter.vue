<template>
  <footer class="main-footer footer">
    <div class="level is-mobile">
      <div
        class="level-item"
        @click="toSoldOut"
      >
        <div class="icon is-2x">
          <font-awesome-icon
            icon="table"
            size="2x"
          />
        </div>
      </div>
      <div
        class="level-item"
        @click="toSchedule"
      >
        <span class="icon is-2x">
          <font-awesome-icon
            icon="calendar"
            size="2x"
          />
        </span>
      </div>
      <div
        class="level-item"
        @click="toHome"
      >
        <span class="icon is-2x">
          <font-awesome-icon
            icon="user"
            size="2x"
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
    toSchedule () {
      this.$router.push('/schedule')
    },
    toHome () {
      this.$router.push('/')
    }
  }
}
</script>
<style scoped>
.main-footer {
  background-color: lavenderblush;
  padding: 12px 24px;
  width: 100vw;
  z-index: 100;
}
</style>
