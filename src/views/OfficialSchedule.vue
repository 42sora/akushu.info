<template>
  <div class="container">
    <div class="notification">
      <div
        v-for="schedule in schedules"
        :key="schedule[0].date"
      >
        <div class="list">
          <div
            class="list-item"
          >
            <h2 class="subtitle has-text-weight-bold">
              {{ schedule[0].date }}
            </h2>
            <div
              v-for="(item, index) in schedule"
              :key="item.goodsName"
            >
              <div
                class="item"
                :class="getGroupNameClass(item.groupName)"
              >
                {{ item.groupName }} {{ item.goodsNumber }}
                <span class="is-hidden-mobile">「{{ item.goodsName }}」</span>
              </div>
              <div
                class="item"
                :style="getPlaceStyle(item.place)"
              >
                {{ item.place }}
              </div>
              <div
                class="item"
                :class="getEventTypeClass(item.eventType)"
              >
                {{ item.eventType }}
              </div>
              <div
                v-if="index!==schedule.length-1"
                class="separator"
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
const placeColors = [
  '#ffcce5',
  '#e5ccff',
  '#ccccff',
  '#cce5ff',
  '#ccffe5',
  '#e5ffcc',
  '#ffffcc',
  '#ffe5cc'
]
const getNowMonth = () => new Date().getMonth() + 1
export default {
  name: 'OfficialSchedule',
  computed: {
    sorted () {
      const toInt = str => parseInt(str.replace(/[^0-9^.]/g, ''), 10)
      const getMonth = date => {
        const splited = date.split('月')
        return toInt(splited[0])
      }
      const getDay = date => {
        const splited = date.split('月')
        return toInt(splited[1])
      }
      const compare = (a, b) => getMonth(a.date) - getMonth(b.date) || getDay(a.date) - getDay(b.date)
      return this.$store.state.public.officialSchedule.akushu.slice()
        .filter(schedule => getMonth(schedule.date) >= getNowMonth())
        .sort(compare)
    },
    schedules () {
      const results = []
      let before
      for (const current of this.sorted) {
        if (before != null && before.date === current.date) {
          results[results.length - 1].push(current)
        } else {
          results.push([current])
        }
        before = current
      }
      return results
    },
    allPlace () {
      return this.sorted.map(schedule => schedule.place)
        .filter((x, i, self) => self.indexOf(x) === i)
    }
  },
  methods: {
    getGroupNameClass (groupName) {
      return {
        'bk-coler-nogi': groupName.includes('乃木坂'),
        'bk-coler-keyaki': groupName.includes('欅坂'),
        'bk-coler-yoshimoto': groupName.includes('吉本坂'),
        'bk-coler-hinata': groupName.includes('日向坂')
      }
    },
    getEventTypeClass (eventType) {
      return {
        'zenkoku': eventType.includes('全国'),
        'kobetsu': eventType.includes('個別')
      }
    },
    getPlaceStyle (place) {
      const placeIndex = this.allPlace.findIndex(x => x === place)
      const color = placeColors[placeIndex % placeColors.length]
      return {
        'background-color': color
      }
    }
  }
}
</script>
<style scoped>
.item{
  display: inline-block;
  padding: 4px;
  margin-left: 4px;
  margin-bottom: 4px;
  border: solid #4a4a4a 1px;
  border-radius: 24px;
}
.subtitle{
  margin-bottom: 8px;
}
.list-item{
  margin-bottom: 12px;
}
.separator{
  margin-bottom: 4px;
  border-bottom: solid lightgray 2px;
}
.zenkoku{
  background-color: #7fbfff;
}
.kobetsu{
  background-color: #ffff7f;
}
</style>
