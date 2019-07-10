<template>
  <table>
    <thead>
      <flip-transition-tr>
        <th
          :key="'date-header-1'"
          colspan="2"
        />
        <th
          v-for="header in eventHeader"
          :key="header.date"
          :colspan="header.parts.length"
          :class="{'is-selected-header':header.isSelected}"
          @click="tapHeader(header.date)"
        >
          {{ header.date }}
        </th>
      </flip-transition-tr>
      <flip-transition-tr>
        <th
          :key="'place-header-1'"
          colspan="2"
        />
        <th
          v-for="header in eventHeader"
          :key="header.date"
          :colspan="header.parts.length"
          :class="{'is-selected-header':header.isSelected}"
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
        <template v-for="header in eventHeader">
          <th
            v-for="(part,i) in header.parts"
            :key="header.date + part"
            :class="{'part-end':i+1===header.parts.length}"
          >
            {{ dPart(part) }}
          </th>
        </template>
      </flip-transition-tr>
      <tr
        v-for="(body,i) in memberBody"
        :key="body.name"
      >
        <th
          :key="body.name+'-name'"
          class="sticky"
          :class="{'is-selected-member':body.isSelected}"
          @click="tapMemberName(body.name)"
        >
          {{ dName(body.name) }}
        </th>
        <td
          :key="body.name+'-total'"
          :class="{'is-sold-out':body.soldOut===body.total}"
        >
          {{ dTotal(body.soldOut,body.total) }}
        </td>
        <template v-for="(status,j) in body.status">
          <td
            v-for="(state,k) in status"
            :key="body.name+eventHeader[j].date+k"
            :class="{
              'part-end':k+1===status.length,
              'is-sold-out':status.every(state => state !== '*')&&!status.every(state => state === '-'),
              'is-lastest':state===currentOrder-1
            }"
          >
            {{ dState(state) }}
            <span class="tooltip">
              <span
                class="text"
                :class="getTooltipClass(i,j)"
              >
                {{ dName(body.name)+" "+eventHeader[j].prefecture+"："+eventHeader[j].parts[k] }}
              </span>
            </span>
          </td>
        </template>
      </tr>
    </flip-transition-tbody>
  </table>
</template>
<script>
import { unique } from '@/utils/ArrayUtil'
import FlipTransitionTr from '@/components/transitions/FlipTransitionTr'
import FlipTransitionTbody from '@/components/transitions/FlipTransitionTbody'
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
const toInt = str => parseInt(str.replace(/[^0-9^.]/g, ''), 10)
const cutDate = str => /[0-9]+月[0-9]+日/.exec(str)[0]
const padding = num => num.toString().padStart(2, '0')
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
    sortedEvents () {
      return this.events.slice()
        .sort((a, b) => this.isSelectedDate(b.eventDetail) - this.isSelectedDate(a.eventDetail) || toInt(a.eventDetail) - toInt(b.eventDetail))
    },
    eventHeader () {
      return this.sortedEvents
        .map(event => {
          return {
            date: cutDate(event.eventDetail),
            place: event.eventDetail.split('・').pop(),
            prefecture: event.eventDetail.split(/[)）]/).pop().split('・').shift(),
            parts: event.tickets.map(ticket => ticket.partName).filter(unique),
            isSelected: this.selectedDate.includes(cutDate(event.eventDetail))
          }
        })
    },
    memberBody () {
      return this.events.flatMap(event => event.tickets)
        .map(ticket => ticket.memberName)
        .filter(unique)
        .map(member => {
          const status = this.sortedEvents
            .map(event =>
              event.tickets
                .filter(ticket => ticket.memberName === member)
                .map(ticket => ticket.state))
            .map((status, index) => status.length === 0 ? this.getAllNone(index) : status)
          return {
            name: member,
            soldOut: status.flat().reduce((total, state) => typeof state === 'number' ? ++total : total, 0),
            total: status.flat().reduce((total, state) => state !== '-' ? ++total : total, 0),
            status: status,
            isSelected: this.selectedMembers.includes(member)
          }
        })
        .sort((a, b) =>
          this.selectedMembers.indexOf(b.name) - this.selectedMembers.indexOf(a.name) ||
          b.soldOut - a.soldOut ||
          b.total - a.total ||
          a.status.flat().reduce((total, state) => typeof state === 'number' ? total + state : total, 0) - b.status.flat().reduce((total, state) => typeof state === 'number' ? total + state : total, 0))
    },
    currentOrder () {
      const parsed = /第([0-9]+)次/.exec(this.eventName)
      if (parsed === null) {
        return -1
      }
      return parseInt(parsed[1], 10)
    }
  },
  methods: {
    getAllNone (index) {
      return this.eventHeader[index].parts.map(_ => '-')
    },
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
    isSelectedDate (eventDetail) {
      return this.selectedDate.includes(cutDate(eventDetail))
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
    },
    getTooltipClass (memberIndex, statusIndex) {
      const memberLength = this.memberBody.length
      const statusLength = this.memberBody[memberIndex].status.length
      return {
        top: memberIndex + 1 > memberLength / 2,
        bottom: memberIndex + 1 <= memberLength / 2,
        left: statusIndex + 1 > statusLength / 2,
        right: statusIndex + 1 <= statusLength / 2
      }
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
      padding: 1px 0;
      position: relative;

      .tooltip .text {
        background-color: black;
        border-radius: 10px;
        color: white;
        opacity: 0;
        padding: 5px 10px;
        position: absolute;
        visibility: hidden;
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
          opacity: 0.8;
          transition: opacity 800ms cubic-bezier(1, 0, 0.5, 0);
          visibility: visible;
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
