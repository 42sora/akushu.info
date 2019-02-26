<template>
  <v-container>
    <v-container v-for="event in fortune" :key="event.eventDate" >
      <p>{{event.eventDate}}</p>
      <p>{{event.eventPlace}}</p>
      <v-data-table
      :headers="headers(event.tickets)"
      :items="toTableData(event.tickets)"
      class="elevation-1"
      >
        <template slot="items" slot-scope="props">
          <td v-for="data in props.item"
          :key="data"
          class="text-xs-center"
          >{{ data }}</td>
        </template>
      </v-data-table>
    </v-container>
  </v-container>
</template>

<script>
export default {
  name: 'home',
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
  },
  methods: {
    toTableData (tickets) {
      const members = tickets.map(x => x.memberName).filter((x, i, self) => self.indexOf(x) === i)
      const parts = tickets.map(x => x.partName).filter((x, i, self) => self.indexOf(x) === i).sort()

      const table = []

      // ヘッダー部（メンバー名）
      // table.push([''].concat(parts))

      // データ部作成
      for (const member of members) {
        // 行の最初にpartNameを入れる
        const row = [member]

        for (const part of parts) {
          // その部のそのメンバーの券があるか探す
          const ticket = tickets
            .find(ticket => ticket.memberName === member && ticket.partName === part)
          if (ticket) {
            row.push(ticket.amont)
          } else {
            row.push('-')
          }
        }
        table.push(row)
      }

      return table
    },
    headers (tickets) {
      return [''].concat(
        tickets
          .map(x => x.partName)
          .filter((x, i, self) => self.indexOf(x) === i)
          .sort())
        .map(part => { return { text: part, value: part, width: 100 } })
    }
  }
}
</script>
<style>
</style>
