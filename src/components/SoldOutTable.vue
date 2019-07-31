<template>
  <table>
    <thead>
      <flip-transition-tr>
        <th
          :key="'date-header-1'"
          colspan="2"
        />
        <th
          v-for="header in sortedHeader"
          :key="header.date"
          :colspan="header.parts.length"
          :class="{'is-selected-header':isSelectedDate(header.date)}"
          @click="tapHeader(header.date)"
        >
          {{ header.displayDate }}
        </th>
      </flip-transition-tr>
      <flip-transition-tr>
        <th
          :key="'place-header-1'"
          colspan="2"
        />
        <th
          v-for="header in sortedHeader"
          :key="header.date"
          :colspan="header.parts.length"
          :class="{'is-selected-header':isSelectedDate(header.date)}"
          @click="tapHeader(header.date)"
        >
          {{ header.place }}
        </th>
      </flip-transition-tr>
    </thead>
    <flip-transition-tbody
      class="is-size-7"
      name="flip-fast"
    >
      <flip-transition-tr :key="'part-header'">
        <th :key="'part-header-1'" />
        <th :key="'part-header-2'">
          合計
        </th>
        <template v-for="header in sortedHeader">
          <th
            v-for="part in header.parts"
            :key="header.date + part.fullName"
            :class="part.class"
          >
            {{ part.shortName }}
          </th>
        </template>
      </flip-transition-tr>
      <tr
        v-for="row in sortedBody"
        :key="row.name"
      >
        <th
          :key="row.name+'-name'"
          class="sticky"
          :class="{'is-selected-member':isSelectedMember(row.name)}"
          @click="tapMemberName(row.name)"
        >
          {{ row.name }}
        </th>
        <td
          :key="row.name+'-progress'"
          :class="{'is-sold-out':row.isSoldOut}"
        >
          {{ row.progress }}
        </td>
        <template v-for="(status,i) in row.status">
          <td
            v-for="(state,j) in status"
            :key="row.name+i+j"
            :class="state.class"
          >
            {{ state.displayState }}
            <span class="tooltip">
              <span
                class="text"
                :class="state.tooltip.class"
              >
                {{ state.tooltip.text }}
              </span>
            </span>
          </td>
        </template>
      </tr>
    </flip-transition-tbody>
  </table>
</template>
<script>
import { unique, count, total } from '@/utils/ArrayUtil'
import { compareDateStr, format } from '@/utils/DateUtil'
import FlipTransitionTr from '@/components/transitions/FlipTransitionTr'
import FlipTransitionTbody from '@/components/transitions/FlipTransitionTbody'
const toDisplayDate = str => /[0-9]+月[0-9]+日/.exec(str)[0]
const toDisplayPart = part => {
  switch (part) {
    case '１部':case '第１部': return 1
    case '２部':case '第２部': return 2
    case '３部':case '第３部': return 3
    case '４部':case '第４部': return 4
    case '５部':case '第５部': return 5
    case '６部':case '第６部': return 6
    case '７部':case '第７部': return 7
    case '８部':case '第８部': return 8
    case '９部':case '第９部': return 9
    default: return part
  }
}
const toDisplayName = name => name.replace(/\s+/g, '')
const padding = num => num.toString().padStart(2, '0')
const toDisplayProgress = (soldOut, total) => padding(soldOut) + '/' + padding(total)
const toDisplayState = state => {
  switch (state) {
    case '-': return '―'
    case '*': return '◯'
    case 1:return '❶'
    case 2:return '❷'
    case 3:return '❸'
    case 4:return '❹'
    case 5:return '❺'
    case 6:return '❻'
    case 7:return '❼'
    case 8:return '❽'
    case 9:return '❾'
    case 10:return '❿'
    case 11:return '⓫'
    case 12:return '⓬'
    case 13:return '⓭'
    case 14:return '⓮'
    case 15:return '⓯'
    case 16:return '⓰'
    case 17:return '⓱'
    case 18:return '⓲'
    case 19:return '⓳'
    case 20:return '⓴'
    default: return state
  }
}
const sumAllStatus = status =>
  status.flat()
    .map(it => it.state)
    .reduce(total(state => typeof state === 'number'))

export default {
  components: { FlipTransitionTr, FlipTransitionTbody },
  props: {
    eventName: { type: String, required: true },
    events: { type: Array, required: true }
  },
  data: function () {
    return {
      selectedMembers: [],
      selectedDate: []
    }
  },
  computed: {
    eventHeader () {
      return this.events
        .map(event => {
          return {
            date: format(event.eventDetail),
            displayDate: toDisplayDate(event.eventDetail),
            place: event.eventDetail.split('・').pop(),
            prefecture: event.eventDetail.split(/[)）]/).pop().split('・').shift(),
            parts: event.tickets.map(ticket => ticket.partName).filter(unique).map((partName, i, self) => {
              return {
                fullName: partName,
                shortName: toDisplayPart(partName),
                class: { 'part-end': i + 1 === self.length }
              }
            })
          }
        })
    },
    sortedHeader () {
      const selected = (a, b) => this.isSelectedDate(b.date) - this.isSelectedDate(a.date)
      const dateOrder = (a, b) => compareDateStr(a.date, b.date)
      return this.eventHeader.slice().sort((a, b) => selected(a, b) || dateOrder(a, b))
    },
    memberBody () {
      const currentOrder = this.currentOrder
      return this.events
        .flatMap(event => event.tickets)
        .map(ticket => ticket.memberName)
        .filter(unique)
        .map((member, memberIndex, body) => {
          const statusList = this.events
            .map(event =>
              event.tickets
                .filter(ticket => ticket.memberName === member)
                .map(ticket => ticket.state))
            .map((status, index) => status.length === 0 ? this.allNone[index] : status)
          const soldOut = statusList.flat().reduce(count(state => typeof state === 'number'), 0)
          const total = statusList.flat().reduce(count(state => state !== '-'), 0)
          return {
            name: toDisplayName(member),
            status: statusList.map((status, i) => {
              const header = this.eventHeader[i]
              const isSoldOut = status.every(state => state !== '*') && !status.every(state => state === '-')
              const ret = status.map((state, j) => {
                return {
                  state: state,
                  displayState: toDisplayState(state),
                  class: {
                    'part-end': j + 1 === status.length,
                    'is-sold-out': isSoldOut,
                    'is-lastest': state === currentOrder - 1
                  },
                  tooltip: {
                    text: `${toDisplayName(member)} ${header.prefecture}：${header.parts[j].fullName}`,
                    class: [
                      memberIndex > body.length / 2 ? 'top' : 'bottom',
                      i > status.length / 2 ? 'left' : 'right'
                    ]
                  }
                }
              })
              ret.header = header
              return ret
            }),
            soldOut: soldOut,
            total: total,
            progress: toDisplayProgress(soldOut, total),
            isSoldOut: soldOut === total
          }
        })
    },
    sortedBody () {
      const sorted = this.memberBody.slice().sort((a, b) =>
        this.selectedMembers.indexOf(b.name) - this.selectedMembers.indexOf(a.name) ||
        b.soldOut - a.soldOut ||
        b.total - a.total ||
        sumAllStatus(a.status) - sumAllStatus(b.status))

      const selected = (a, b) => this.isSelectedDate(b.header.date) - this.isSelectedDate(a.header.date)
      const dateOrder = (a, b) => compareDateStr(a.header.date, b.header.date)
      sorted.forEach(it =>
        it.status.sort((a, b) => selected(a, b) || dateOrder(a, b)))
      return sorted
    },
    currentOrder () {
      const parsed = /第([0-9]+)次/.exec(this.eventName)
      if (parsed === null) {
        return -1
      }
      return parseInt(parsed[1], 10)
    },
    allNone () {
      return this.eventHeader.map(header => header.parts.map(_ => '-'))
    }
  },
  methods: {
    tapHeader (date) {
      if (this.selectedDate.includes(date)) {
        this.selectedDate = this.selectedDate.filter(x => x !== date)
      } else {
        this.selectedDate.unshift(date)
      }
    },
    tapMemberName (name) {
      if (this.selectedMembers.includes(name)) {
        this.selectedMembers = this.selectedMembers.filter(x => x !== name)
      } else {
        this.selectedMembers.unshift(name)
      }
    },
    isSelectedDate (date) {
      return this.selectedDate.includes(date)
    },
    isSelectedMember (name) {
      return this.selectedMembers.includes(name)
    }
  }
}
</script>
<style lang="scss" scoped>
table {
  border-collapse: separate;
  border-width: 0;

  * {
    background-color: white;
  }

  th,
  td {
    border-color: lightgray;
    border-style: solid;
    border-width: 0 2px 1px 0;
  }

  thead tr {
    th {
      border-right-color: #a0a0a0;
      border-width: 0 2px 2px 0;
      padding: 8px 0;

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
      border-width: 0 2px 1px 0;
      padding: 1px 0 3px 0;
      position: relative;

      .tooltip .text {
        background-color: rgba(0, 0, 0, 0.8);
        border-radius: 10px;
        display: none;
        padding: 5px 10px;
        position: absolute;
        white-space: nowrap;
        z-index: 2;

        &.top {
          bottom: 70%;
        }

        &.bottom {
          top: 70%;
        }

        &.right {
          left: 70%;
        }

        &.left {
          right: 70%;
        }
      }

      &:hover {
        background-color: #1f91ff;
        color: white;

        .tooltip .text {
          @keyframes fade-in {
            0% {
              opacity: 0;
            }

            100% {
              opacity: 1;
            }
          }

          animation-delay: 400ms;
          animation-duration: 400ms;
          animation-fill-mode: both;
          animation-name: fade-in;
          animation-timing-function: ease-out;
          display: block;
        }
      }
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
  cursor: pointer;
  left: 0;
  min-width: 64px;
  position: sticky;
  z-index: 1;
}

.part-end:not(:last-child) {
  border-right-color: #a0a0a0;
}

.is-sold-out {
  background-color: #ffff3d;
}

.is-lastest {
  color: #ff3d3d;
}

.is-selected-header {
  background-color: #1f91ff;
  color: white;
}

.is-selected-member {
  background-color: #1f91ff;
  border-bottom-color: #1f91ff;
  color: white;
}

.flip-move {
  transition: transform 400ms ease;
  will-change: transform;
}

.flip-fast-move {
  transition: transform 200ms ease;
  will-change: transform;
}
</style>
