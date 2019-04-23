<template>
  <div class="akuTable">
    <table class="table">
      <template
        v-for="(row,rowIndex) in tableData"
      >
        <thead
          v-if="rowIndex===0"
          :key="row[0]"
        >
          <tr>
            <td
              v-for="(x,i) in row"
              :key="tableData[0][i]"
              class="has-text-centered"
            >
              {{ x }}
            </td>
          </tr>
        </thead>
        <tbody
          v-else
          :key="row[0]"
        >
          <tr>
            <td
              v-for="(x,i) in row"
              :key="tableData[0][i]"
              class="has-text-centered"
              :class="{'no-wrap':i===0}"
            >
              {{ x }}
            </td>
          </tr>
        </tbody>
      </template>
    </table>
  </div>
</template>

<script>
export default {
  props: {
    tickets: { type: Array, required: true }
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
<style scoped>
.no-wrap{
  white-space: nowrap;
}
</style>
