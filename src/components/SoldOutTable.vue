<template>
  <div>
    <table>
      <thead>
        <tr>
          <th colspan="2" />
          <th
            v-for="header in eventHeader"
            :key="header.date"
            :colspan="header.parts.length"
          >
            {{ header.date }}
          </th>
        </tr>
        <tr>
          <th colspan="2" />
          <th
            v-for="header in eventHeader"
            :key="header.date"
            :colspan="header.parts.length"
          >
            {{ header.place }}
          </th>
        </tr>
      </thead>
      <tbody class="is-size-7">
        <tr>
          <th />
          <th>合計</th>
          <template v-for="header in eventHeader">
            <th
              v-for="(part,i) in header.parts"
              :key="header.date + part"
              :class="{'part-end':i+1===header.parts.length}"
            >
              {{ dPart(part) }}
            </th>
          </template>
        </tr>
        <tr
          v-for="body in memberBody"
          :key="body.name"
        >
          <th class="sticky">
            <div>
              {{ dName(body.name) }}
            </div>
          </th>
          <td>{{ dTotal(body.soldOut,body.total) }}</td>
          <template v-for="(status,i) in body.status">
            <td
              v-for="(state,j) in status"
              :key="i*1000+j"
              :class="{'part-end':j+1===status.length}"
            >
              {{ dState(state) }}
            </td>
          </template>
        </tr>
      </tbody>
    </table>
  </div>
</template>
<script>
import { unique } from '@/utils/ArrayUtil'
const displayPartMap = {
  '１部': 1,
  '２部': 2,
  '３部': 3,
  '４部': 4,
  '５部': 5,
  '６部': 6,
  '７部': 7,
  '８部': 8,
  '９部': 9
}
const displayNumberMap = {
  1: '❶',
  2: '❷',
  3: '❸',
  4: '❹',
  5: '❺',
  6: '❻',
  7: '❼',
  8: '❽',
  9: '❾',
  10: '❿',
  11: '⓫',
  12: '⓬',
  13: '⓭',
  14: '⓮',
  15: '⓯',
  16: '⓰',
  17: '⓱',
  18: '⓲',
  19: '⓳',
  20: '⓴'
}
const padding = num => num.toString().padStart(2, '0')
export default {
  props: {
    events: { type: Array, required: true }
  },
  computed: {
    eventHeader () {
      return this.events
        .map(event => {
          return {
            date: /[0-9]+月[0-9]+日/.exec(event.eventDetail)[0],
            place: event.eventDetail.split('・').pop(),
            parts: event.tickets.map(ticket => ticket.partName).filter(unique)
          }
        })
    },
    memberBody () {
      return this.events.flatMap(event => event.tickets)
        .map(ticket => ticket.memberName)
        .filter(unique)
        .map(member => {
          const status = this.events
            .map(event =>
              event.tickets
                .filter(ticket => ticket.memberName === member)
                .map(ticket => ticket.state))
            .map((status, index) => status.length === 0 ? this.getAllNone(index) : status)
          return {
            name: member,
            soldOut: status.flat().reduce((total, state) => typeof state === 'number' ? ++total : total, 0),
            total: status.flat().reduce((total, state) => state !== '-' ? ++total : total, 0),
            status: status
          }
        })
    }
  },
  methods: {
    getAllNone (index) {
      return this.eventHeader[index].parts.map(_ => '-')
    },
    dPart (part) {
      for (const [k, v] of Object.entries(displayPartMap)) {
        if (part.includes(k)) {
          return v
        }
      }
      return part
    },
    dTotal (soldOut, total) {
      return padding(soldOut) + '/' + padding(total)
    },
    dName (name) {
      return name.replace(/\s+/g, '')
    },
    dState (state) {
      if (state === '-') {
        return '―'
      } else if (state === '*') {
        return '◯'
      } else {
        return displayNumberMap[state]
      }
    }
  }
}
</script>
<style lang="scss" scoped>
table {
  border-collapse: separate;
  border-width: 0;

  th,
  td {
    border-style: solid;
    border-color: lightgray;
    border-width: 0 2px 1px 0;
  }

  thead tr {
    th {
      padding: 8px 0;
      border-width: 0 2px 2px 0;
      border-right-color: #a0a0a0;

      &:first-child {
        border-right-color: lightgray;
      }

      &:last-child {
        border-right-width: 0;
      }
    }
  }

  tbody tr {
    * {
      text-align: center;
      vertical-align: middle;
    }

    td {
      padding: 2px 0;
      border-width: 0 2px 1px 0;
    }

    &:last-child {
      th,
      td {
        border-bottom-width: 0;
      }
    }

    &:first-child th {
      border-bottom-width: 2px;

      &:last-child {
        border-right-width: 0;
      }
    }

    td:last-child {
      border-right-width: 0;
    }
  }
}

.sticky {
  min-width: 64px;
  background: white;
  position: sticky;
  left: 0;
  z-index: 1;
}

.part-end:not(:last-child) {
  border-right-color: #a0a0a0;
}
</style>
