<template>
  <div class="soldOutTable">
    <table class="table is-bordered is-size-7 padding-zero">
      <thead>
        <tr>
          <th rowspan="3" />
          <th />
          <th
            v-for="(date ,i) in dateHeader"
            :key="date"
            :colspan="partHeader[i].length"
          >
            {{ date }}
          </th>
        </tr>
        <tr>
          <th />
          <th
            v-for="(place ,i) in placeHeader"
            :key="i"
            :colspan="partHeader[i].length"
            class="title-cell"
          >
            {{ place }}
          </th>
        </tr>
        <tr>
          <th>合計</th>
          <template v-for="parts in partHeader">
            <th
              v-for="part in parts"
              :key="getKey(part)"
              class="has-text-centered"
            >
              {{ part }}
            </th>
          </template>
        </tr>
      </thead>
      <tbody>
        <tr
          v-for="member in members"
          :key="member"
        >
          <th class="title-cell">
            {{ normalizeMemberName(member) }}
          </th>
          <td>{{ getDisplayTotal(member) }}</td>
          <template v-for="detail in merged.details">
            <template v-if="getStatus(member,detail.detailName).length>0">
              <td
                v-for="state in getStatus(member,detail.detailName)"
                :key="getKey(state)"
                class="has-text-centered"
                :class="{
                  'has-background-warning':!getStatus(member,detail.detailName).includes('◯'),
                  'has-text-danger':state===lastCompleted
                }"
              >
                {{ state }}
              </td>
            </template>
            <template v-else>
              <td
                v-for="dummy in getDummy(detail.detailName)"
                :key="getKey(dummy)"
                class="has-text-centered"
              >
                {{ dummy }}
              </td>
            </template>
          </template>
        </tr>
      </tbody>
    </table>
  </div>
</template>
<script>
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
const eventNameToInt = eventName => parseInt(/第([0-9]+)次/.exec(eventName)[1], 10)
export default {
  props: {
    event: { type: Array, required: true }
  },
  computed: {
    sorted () {
      const compare = (a, b) => eventNameToInt(a.eventName) - eventNameToInt(b.eventName)
      return this.event.slice().sort(compare).reverse()
    },
    merged () {
      return this.sorted.slice()
        .reduce((preEvent, curEvent) => {
          const resultDetails = preEvent.details.slice()
          for (const curDetail of curEvent.details) {
            if (resultDetails.every(r => r.detailName !== curDetail.detailName)) {
              resultDetails.unshift(curDetail)
            }
          }
          const resultEvent = Object.assign({}, preEvent)
          resultEvent.details = resultDetails
          return resultEvent
        })
    },
    dateHeader () {
      return this.merged.details.map(detail => detail.detailName)
        .map(name => /[0-9]+月[0-9]+日/.exec(name)[0])
    },
    placeHeader () {
      return this.merged.details.map(detail => detail.detailName)
        .map(name => name.split('・').pop())
    },
    partHeader () {
      return this.merged.details.map(detail =>
        detail.status[0].filter(name => name !== '')
          .map(name => {
            if (name.includes('１部')) {
              return 1
            } else if (name.includes('２部')) {
              return 2
            } else if (name.includes('３部')) {
              return 3
            } else if (name.includes('４部')) {
              return 4
            } else if (name.includes('５部')) {
              return 5
            } else if (name.includes('６部')) {
              return 6
            } else if (name.includes('７部')) {
              return 7
            } else if (name.includes('８部')) {
              return 8
            } else if (name.includes('９部')) {
              return 9
            } else {
              return name
            }
          })
      )
    },
    members () {
      const compare = (a, b) => {
        const aTotal = this.getTotal(a)
        const bTotal = this.getTotal(b)
        return bTotal.soldOut - aTotal.soldOut || bTotal.number - aTotal.number
      }
      return this.sorted.flatMap(event => event.details)
        .flatMap(detail => detail.status)
        .map(status => status[0])
        .filter(name => name !== '')
        .filter((x, i, self) => self.indexOf(x) === i)
        .sort(compare)
    },
    lastCompleted () {
      if (this.sorted.length > 1) {
        return displayNumberMap[eventNameToInt(this.sorted[1].eventName)]
      }
      return ''
    }
  },
  methods: {
    getKey (_) {
      return Symbol('')
    },
    getStatus (member, detailName) {
      return this.merged.details.find(detail => detail.detailName === detailName).status
        .filter(status => status[0] === member)
        .flatMap(state => state.slice(1))
        .map((state, i) => {
          if (state.includes('0')) {
            return '◯'
          } else if (state.includes('SOLD OUT')) {
            const eventName = this.sorted.find(event =>
              event.details.some(detail =>
                detail.detailName === detailName &&
                detail.status.some(status =>
                  status[0] === member && !status[i + 1].includes('SOLD OUT')))).eventName
            return displayNumberMap[eventNameToInt(eventName)]
          } else if (state.includes('---')) {
            return '―'
          } else {
            return state
          }
        })
    },
    getDummy (detailName) {
      const detailIndex = this.merged.details.findIndex(detail => detail.detailName === detailName)
      return this.partHeader[detailIndex].map(_ => '―')
    },
    getTotal (member) {
      return this.merged.details.flatMap(detail => detail.status)
        .filter(status => status[0] === member)
        .flatMap(status => status.slice(1))
        .reduce((total, state) => {
          if (state.includes('0')) {
            total.number++
          } else if (state.includes('SOLD OUT')) {
            total.soldOut++
            total.number++
          }
          return total
        }, { soldOut: 0, number: 0 })
    },
    getDisplayTotal (member) {
      const total = this.getTotal(member)
      return padding(total.soldOut) + '/' + padding(total.number)
    },
    normalizeMemberName (memberName) {
      return memberName.replace(/\s+/g, '')
    }
  }
}
</script>
<style scoped>
tbody th {
  position: sticky;
  background: white;
  left: 0;
  z-index: 1;
}
.padding-zero td,
.padding-zero th{
  padding: 0px;
}
.title-cell{
  min-width: 64px;
}
</style>
