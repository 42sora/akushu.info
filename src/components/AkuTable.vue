<template>
  <div class="akuTable">
    <table>
      <tr
        v-for="row in tableData"
        :key="row[0]"
      >
        <td
          v-for="(x,i) in row"
          :key="tableData[0][i]"
        >
          {{ x }}
        </td>
      </tr>
    </table>
  </div>
</template>

<script>
export default {
  props: {
    tickets: { type: Array, required: true },
    filter: { type: Array, default: () => [] }
  },
  computed: {
    tableData () {
      const parts = this.tickets
        .map(x => x.partName)
        .filter((x, i, self) => self.indexOf(x) === i)
        .sort()

      const members = this.tickets
        .map(x => x.memberName)
        .filter((x, i, self) => self.indexOf(x) === i)
        .filter(x => this.filter.length === 0 || this.filter.includes(x))

      const table = []

      // ヘッダー部（パート名）
      table.push([''].concat(parts))

      // データ部作成
      for (const member of members) {
        // 行の最初にmemberNameを入れる
        const row = [member]

        for (const part of parts) {
          const ticket = this.tickets.find(ticket => ticket.memberName === member && ticket.partName === part)
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
