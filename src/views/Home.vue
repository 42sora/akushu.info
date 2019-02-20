<template>
  <div class="home">
    <div v-for="event in fortune" :key="event.eventDate">
      <p>{{event.eventDate}}</p>
      <p>{{event.eventPlace}}</p>
      <b-table :data="toTableData(event.tickets)" :columns='members(event.tickets)' ></b-table>
      <!-- <table>
        <tr v-for="row in toTableData(event.tickets)" :key="row[0]">
          <td v-for="data in row" :key="data">{{data}}</td>
        </tr>
      </table> -->
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
      const members = tickets.map(x => x.memberName).filter((x, i, self) => self.indexOf(x) === i)
      const parts = tickets.map(x => x.partName).filter((x, i, self) => self.indexOf(x) === i).sort()

      const table = []

      // ヘッダー部（メンバー名）
      table.push([''].concat(members))

      // データ部作成
      for (const part of parts) {
        // 行の最初にpartNameを入れる
        const row = { '': part }

        for (const member of members) {
          // その部のそのメンバーの券があるか探す
          const ticket = tickets.filter(ticket => ticket.partName === part)
            .find(ticket => ticket.memberName === member)
          if (ticket) {
            row[member] = ticket.amont
          } else {
            row[member] = '-'
          }
        }
        table.push(row)
      }

      return table
    },
    members (tickets) {
      return [''].concat(
        tickets
          .map(x => x.memberName)
          .filter((x, i, self) => self.indexOf(x) === i))
        .map(member => { return { field: member, label: member } })
    }
  }
}
</script>
<style>
td {
  text-align: center;
}
</style>
