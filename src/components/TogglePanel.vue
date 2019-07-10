<template>
  <div>
    <div @click="toggle">
      <slot name="button" />
    </div>
    <template v-if="display">
      <slot name="content" />
    </template>
  </div>
</template>
<script>
export default {
  data: function () {
    return {
      display: false
    }
  },
  methods: {
    toggle () { this.display = !this.display }
  }
}
</script>
