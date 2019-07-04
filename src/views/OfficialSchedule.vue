<template>
  <div class="official-schedule container">
    <schedule-filter
      class="box"
      :class="filterClass"
      :group-filter="groupFilter"
      :prefecture-filter="prefectureFilter"
      :event-type-filter="eventTypeFilter"
      @click-group="toggleGroupFilter"
      @click-prefecture="togglePrefectureFilter"
      @click-event="toggleEventTypeFilter"
      @chenge-state="filterState=$event"
    />
    <transition-group name="scale-down">
      <schedule-box
        v-for="schedule in schedules"
        :key="schedule[0].date"
        :schedule="schedule"
        class="box"
        @click-group="toggleGroupFilter"
        @click-prefecture="togglePrefectureFilter"
        @click-event="toggleEventTypeFilter"
      />
    </transition-group>
  </div>
</template>
<script>
import ScheduleFilter from '@/components/ScheduleFilter'
import ScheduleBox from '@/components/ScheduleBox'
const getNowYear = () => new Date().getFullYear()
const getNowMonth = () => new Date().getMonth() + 1
const getNowDay = () => new Date().getDate()
export default {
  name: 'OfficialSchedule',
  components: { ScheduleFilter, ScheduleBox },
  data: function () {
    return {
      filterState: '',
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
    filterClass () {
      return {
        sticky: this.filterState !== 'close'
      }
    }
  },
  methods: {
    toggleGroupFilter (group) {
      if (this.groupFilter.includes(group)) {
        this.groupFilter = this.groupFilter.filter(x => x !== group)
      } else {
        this.groupFilter.push(group)
      }
    },
    togglePrefectureFilter (prefecture) {
      if (this.prefectureFilter.includes(prefecture)) {
        this.prefectureFilter = this.prefectureFilter.filter(x => x !== prefecture)
      } else {
        this.prefectureFilter.push(prefecture)
      }
    },
    toggleEventTypeFilter (eventType) {
      if (this.eventTypeFilter.includes(eventType)) {
        this.eventTypeFilter = this.eventTypeFilter.filter(x => x !== eventType)
      } else {
        this.eventTypeFilter.push(eventType)
      }
    }
  }
}
</script>
<style scoped>
.official-schedule {
  padding: 8px 24px;
}

.box {
  padding: 8px 12px;
  margin-bottom: 12px;
}

.sticky {
  position: sticky;
  top: 60px;
}

.scale-down-enter-active {
  transform: scaleY(1);
  max-height: 163px;
  transition: all 200ms ease-in;
}

.scale-down-leave-active {
  transform: scaleY(1);
  max-height: 163px;
  transition: all 200ms ease-out;
}

.scale-down-enter,
.scale-down-leave-to {
  transform: scaleY(0);
  max-height: 0;
}
</style>
