<template>
  <div class="home">
    <div v-for="event in fortune" :key="event.eventDate">
      <p>{{event.eventDate}} {{event.eventPlace}}</p>
      <aku-table :tickets="event.tickets"></aku-table>
    </div>
  </div>
</template>

<script>
import AkuTable from '@/components/AkuTable'
export default {
  name: 'home',
  components: { AkuTable },
  computed: {
    fortune () {
      const compare = (a, b) => {
        if (a === b) { return 0 }
        const splitedA = a.split('-').map(x => parseInt(x, 10))
        const splitedB = b.split('-').map(x => parseInt(x, 10))
        if (splitedA[0] < splitedB[0] ||
        (splitedA[0] === splitedB[0] && splitedA[1] < splitedB[1]) ||
        (splitedA[0] === splitedB[0] && splitedA[1] === splitedB[1] && splitedA[2] < splitedB[2])) {
          return -1
        } else {
          return 1
        }
      }
      return this.$store.state.fortune.slice().sort((a, b) => compare(a.eventDate, b.eventDate)).reverse()
    }
  }
}
</script>
<style>
td {
  text-align: center;
}
</style>
