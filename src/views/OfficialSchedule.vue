<template>
  <div class="official-schedule container">
    <div
      class="box"
      :class="filterBoxClass"
    >
      <button
        class="button is-white is-fullwidth"
        @click="displayFilter=!displayFilter"
      >
        <span>絞り込む</span>
        <span class="icon">
          <font-awesome-icon icon="angle-down" />
        </span>
      </button>
      <div>
        <button
          v-for="group in filteredGroups"
          :key="group"
          class="button item"
          :class="getGroupFilterClass(group)"
          @click="toggleGroupFilter(group)"
        >
          {{ group }}
        </button>
      </div>
      <div>
        <button
          v-for="prefecture in filteredPrefectures"
          :key="prefecture"
          class="button item"
          :style="getPrefectureFilterStyle(prefecture)"
          @click="togglePrefectureFilter(prefecture)"
        >
          {{ prefecture }}
        </button>
      </div>
      <div>
        <button
          v-for="eventType in filteredEventTypes"
          :key="eventType"
          class="button item"
          :class="getEventTypeFilterClass(eventType) "
          @click="toggleEventTypeFilter(eventType)"
        >
          {{ eventType }}
        </button>
      </div>
    </div>
    <div
      v-for="schedule in schedules"
      :key="schedule[0].date"
      class="box"
    >
      <h2 class="subtitle has-text-weight-bold">
        {{ toDisplayDate(schedule[0].date) }}
      </h2>
      <div
        v-for="(item, index) in schedule"
        :key="item.goodsName"
      >
        <div
          class="item"
          :class="getGroupNameClass(item.groupName)"
          @click="toggleGroupFilter(item.groupName)"
        >
          {{ item.groupName }} {{ item.goodsNumber }}
          <span class="is-hidden-mobile">「{{ item.goodsName }}」</span>
        </div>
        <div
          class="item"
          :style="getPlaceStyle(item.place)"
          @click="togglePrefectureFilter(item.place.split(':')[0])"
        >
          {{ item.place }}
        </div>
        <div
          class="item"
          :class="getEventTypeClass(item.eventType)"
          @click="toggleEventTypeFilter(item.eventType)"
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
const getNowYear = () => new Date().getFullYear()
const getNowMonth = () => new Date().getMonth() + 1
const getNowDay = () => new Date().getDate()
export default {
  name: 'OfficialSchedule',
  data: function () {
    return {
      displayFilter: false,
      allGroups: [ '乃木坂46', '欅坂46', '日向坂46', '吉本坂46' ],
      prefectures: ['宮城', '千葉', '東京', '神奈川', '愛知', '京都', '大阪'],
      eventTypes: ['個別握手会', '全国握手会'],
      groupFilter: [],
      prefectureFilter: [],
      eventTypeFilter: []
    }
  },
  computed: {
    sorted () {
      const toInt = str => parseInt(str.replace(/[^0-9^.]/g, ''), 10)
      const getYear = date => toInt(date.split('年')[0])
      const getMonth = date => toInt(date.split('年')[1].split('月')[0])
      const getDay = date => toInt(date.split('月')[1])
      const isFuture = date =>
        getYear(date) > getNowYear() ||
       (getYear(date) === getNowYear() && getMonth(date) > getNowMonth()) ||
       (getYear(date) === getNowYear() && getMonth(date) === getNowMonth() && getDay(date) >= getNowDay())
      const compare = (a, b) => getYear(a.date) - getYear(b.date) || getMonth(a.date) - getMonth(b.date) || getDay(a.date) - getDay(b.date)

      return this.$store.state.public.officialSchedule.akushu.slice()
        .filter(schedule => isFuture(schedule.date))
        .sort(compare)
    },
    filtered () {
      return this.sorted
        .filter(schedule => this.groupFilter.length === 0 || this.groupFilter.includes(schedule.groupName))
        .filter(schedule => this.prefectureFilter.length === 0 || this.prefectureFilter.some(prefecture => schedule.place.includes(prefecture)))
        .filter(schedule => this.eventTypeFilter.length === 0 || this.eventTypeFilter.includes(schedule.eventType))
    },
    schedules () {
      const results = []
      let before
      for (const current of this.filtered) {
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
    },
    filterBoxClass () {
      return {
        sticky: this.displayFilter ||
          this.groupFilter.length > 0 ||
          this.prefectureFilter.length > 0 ||
          this.eventTypeFilter.length > 0
      }
    },
    filteredGroups () {
      return this.displayFilter ? this.allGroups : this.groupFilter
    },
    filteredPrefectures () {
      return this.displayFilter ? this.prefectures : this.prefectureFilter
    },
    filteredEventTypes () {
      return this.displayFilter ? this.eventTypes : this.eventTypeFilter
    }
  },
  methods: {
    toggleGroupFilter (group) {
      if (this.groupFilter.some(x => x === group)) {
        this.groupFilter = this.groupFilter.filter(x => x !== group)
      } else {
        this.groupFilter.push(group)
      }
    },
    togglePrefectureFilter (prefecture) {
      if (this.prefectureFilter.some(x => x === prefecture)) {
        this.prefectureFilter = this.prefectureFilter.filter(x => x !== prefecture)
      } else {
        this.prefectureFilter.push(prefecture)
      }
    },
    toggleEventTypeFilter (eventType) {
      if (this.eventTypeFilter.some(x => x === eventType)) {
        this.eventTypeFilter = this.eventTypeFilter.filter(x => x !== eventType)
      } else {
        this.eventTypeFilter.push(eventType)
      }
    },
    toDisplayDate (date) {
      return date.split('年')[1]
    },
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
    },
    getGroupFilterClass (group) {
      if (this.groupFilter.includes(group)) {
        return this.getGroupNameClass(group)
      } else {
        return {}
      }
    },
    getEventTypeFilterClass (EventType) {
      if (this.eventTypeFilter.includes(EventType)) {
        return this.getEventTypeClass(EventType)
      } else {
        return {}
      }
    },
    getPrefectureFilterStyle (prefecture) {
      if (this.prefectureFilter.includes(prefecture)) {
        const findPlace = this.allPlace.find(place => place.includes(prefecture))
        if (findPlace == null) {
          return { 'background-color': '#e0e0e0' }
        }
        return this.getPlaceStyle(findPlace)
      } else {
        return {}
      }
    }
  }
}
</script>
<style scoped>
.official-schedule{
  padding: 24px;
  background-color: #fff9fc;
}
.box{
  padding: 8px 12px;
  margin-bottom: 12px;
}
.item{
  display: inline-block;
  padding: 4px 8px;
  margin-right: 4px;
  margin-bottom: 4px;
  border: solid #4a4a4a 1px;
  border-radius: 16px;
}
.sticky{
  position: sticky;
  top: 60px;
}
.subtitle{
  margin-bottom: 8px;
}
.separator{
  margin-top: 6px;
  margin-bottom: 8px;
  border-bottom: solid lightgray 2px;
}
.zenkoku{
  background-color: #7fbfff;
}
.kobetsu{
  background-color: #ffff7f;
}
</style>
