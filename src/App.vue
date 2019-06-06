<template>
  <div id="app">
    <main-nav id="sticky-header" />
    <router-view id="main-content" />
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
  position: fixed;
  bottom: 0;
}
#main-content {
  padding-bottom: 72px;
}
.bk-coler-nogi{
  background-color: #ffb7ff;
}
.bk-coler-keyaki{
  background-color: #b7ffb7;
}
.bk-coler-yoshimoto{
  background-color: #ffb7b7;
}
.bk-coler-hinata{
  background-color: #b7ffff;
}
</style>
