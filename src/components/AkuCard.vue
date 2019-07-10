<template>
  <div class="card">
    <header class="card-header">
      <p class="card-header-title">
        {{ event.eventDate }} {{ event.eventPlace }}
      </p>
    </header>
    <div class="card-content">
      <aku-table :tickets="event.tickets" />
    </div>
  </div>
</template>
<script>
import AkuTable from '@/components/AkuTable'
export default {
  components: { AkuTable },
  props: {
    event: { type: Object, required: true }
  }
}
</script>
