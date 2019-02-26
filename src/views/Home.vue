<template>
  <div class="home">
    <div v-for="event in fortune" :key="event.eventDate">
      <p>{{event.eventDate}}</p>
      <p>{{event.eventPlace}}</p>
      <table>
        <tr v-for="row in toTableData(event.tickets)" :key="row[0]">
          <td v-for="data in row" :key="data">{{data}}</td>
        </tr>
      </table>
    </div>
  </div>
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
      const parts = tickets.map(x => x.partName).filter((x, i, self) => self.indexOf(x) === i).sort()
      const members = tickets.map(x => x.memberName).filter((x, i, self) => self.indexOf(x) === i)

      const table = []

      // ヘッダー部（メンバー名）
      table.push([''].concat(parts))

      // データ部作成
      for (const member of members) {
        // 行の最初にmemberNameを入れる
        const row = [member]

        for (const part of parts) {
          const ticket = tickets.find(ticket => ticket.memberName === member && ticket.partName === part)
          if (ticket) {
            row.push(ticket.amont)
          } else {
            row.push('-')
          }
        }
        table.push(row)
      }

      return table
    }
  }
}
</script>
<style>
td {
  text-align: center;
}
</style>
