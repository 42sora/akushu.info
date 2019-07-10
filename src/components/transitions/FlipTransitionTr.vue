<template>
  <transition-group
    :name="name"
    tag="tr"
  >
    <slot />
  </transition-group>
</template>
<script>
export default {
  props: {
    name: { type: String, default: 'flip' }
  }
}
</script>
