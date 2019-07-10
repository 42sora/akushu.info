<template>
  <transition-group
    name="scale-down"
    @enter="enter"
    @leave="leave"
  >
    <slot />
  </transition-group>
</template>
<script>
const toInt = str => parseInt(str.replace(/[^0-9^.]/g, ''), 10)
const toSuffix = str => str.replace(/[0-9]+/g, '')
export default {
  props: {
    duration: { type: Number, default: 300 }
  },
  methods: {
    enter (element, done) {
      const style = window.getComputedStyle(element, '')

      const height = toInt(style.height)
      const heightSuffix = toSuffix(style.height)
      const paddingTop = toInt(style.paddingTop)
      const paddingTopSuffix = toSuffix(style.paddingTop)
      const paddingBottom = toInt(style.paddingBottom)
      const paddingBottomSuffix = toSuffix(style.paddingBottom)

      element.style.overflow = 'hidden'

      const duration = this.duration
      const startTime = Date.now()
      const render = () => {
        const time = Date.now() - startTime
        const nowHeight = time / duration * height
        const nowPaddingTop = time / duration * paddingTop
        const nowPaddingBottom = time / duration * paddingBottom

        element.style.height = nowHeight + heightSuffix
        element.style.paddingTop = nowPaddingTop + paddingTopSuffix
        element.style.paddingBottom = nowPaddingBottom + paddingBottomSuffix

        if (time < duration) {
          window.requestAnimationFrame(render)
        } else {
          element.style.overflow = ''
          element.style.height = ''
          element.style.paddingTop = ''
          element.style.paddingBottom = ''
          done()
        }
      }
      window.requestAnimationFrame(render)
    },
    leave (element, done) {
      const style = window.getComputedStyle(element, '')

      const height = toInt(style.height)
      const heightSuffix = toSuffix(style.height)
      const paddingTop = toInt(style.paddingTop)
      const paddingTopSuffix = toSuffix(style.paddingTop)
      const paddingBottom = toInt(style.paddingBottom)
      const paddingBottomSuffix = toSuffix(style.paddingBottom)

      element.style.overflow = 'hidden'

      const duration = this.duration
      const startTime = Date.now()
      const render = () => {
        const time = Date.now() - startTime
        const nowHeight = height - (time / duration * height)
        const nowPaddingTop = paddingTop - (time / duration * paddingTop)
        const nowPaddingBottom = paddingBottom - (time / duration * paddingBottom)

        element.style.height = nowHeight + heightSuffix
        element.style.paddingTop = nowPaddingTop + paddingTopSuffix
        element.style.paddingBottom = nowPaddingBottom + paddingBottomSuffix

        if (time < duration) {
          window.requestAnimationFrame(render)
        } else {
          element.style.overflow = ''
          element.style.height = ''
          element.style.paddingTop = ''
          element.style.paddingBottom = ''
          done()
        }
      }
      window.requestAnimationFrame(render)
    }
  }
}
</script>
