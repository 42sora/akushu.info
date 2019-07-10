<template>
  <div id="app">
    <main-nav id="sticky-header" />
    <transition name="fade">
      <router-view id="main-content" />
    </transition>
    <main-footer id="sticky-footer" />
  </div>
</template>
<script>
import MainNav from '@/components/MainNav'
import MainFooter from '@/components/MainFooter'
export default {
  components: { MainNav, MainFooter }
}
</script>
<style lang="scss">
@import "@/style/style.scss";

#sticky-header {
  position: sticky;
  top: 0;
}

#sticky-footer {
  bottom: 0;
  position: fixed;
}

#main-content {
  padding-bottom: 72px;
}

.fade-enter-active {
  transition: opacity 100ms;
}

.fade-enter {
  opacity: 0;
}
</style>
