<template>
  <div class="container">
    <aku-card
      :key="event.eventDate"
      :event="event"
      :enable-share="false"
    />
  </div>
</template>
<script>
import AkuCard from '@/components/AkuCard'
export default {
  name: 'Share',
  components: { AkuCard },
  computed: {
    event () {
      const q = this.$route.query.q
      return JSON.parse(q)
    }
  }
}
</script>
