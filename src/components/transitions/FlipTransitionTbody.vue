<template>
  <transition-group
    :name="name"
    tag="tbody"
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
