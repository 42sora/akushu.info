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
import { unique } from '@/utils/ArrayUtil'
export default {
  props: {
    tickets: { type: Array, required: true }
  },
  computed: {
    tableData () {
      const parts = this.tickets
        .map(x => x.partName)
        .filter(unique)
        .sort()

      const members = this.tickets
        .map(x => x.memberName)
        .filter(unique)

      // ヘッダー部（パート名）
      const head = [[''].concat(parts)]

      // データ部作成
      const body = []
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
        body.push(row)
      }

      const ifNotNumThenZero = x => typeof x !== 'number' ? 0 : x
      const compareTotal = (a, b) => a.reduce((total, v) => total + v, 0) - b.reduce((total, v) => total + v, 0) || compareEach(a, b, 1)
      const compareEach = (a, b, i) => a.length - 1 === i ? 0 : a[i] - b[i] || compareEach(a, b, i + 1)
      const compare = (a, b) => compareTotal(a.map(ifNotNumThenZero), b.map(ifNotNumThenZero)) || compareEach(a.map(ifNotNumThenZero), b.map(ifNotNumThenZero), 1)

      body.sort(compare).reverse()

      const table = head.concat(body)

      return table
    }
  }
}
</script>
<style scoped>
.no-wrap {
  white-space: nowrap;
}
</style>
