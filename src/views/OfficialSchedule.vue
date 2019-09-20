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
    <scale-down-transition-group>
      <schedule-box
        v-for="schedule in futureSchedules"
        :key="schedule[0].date"
        :schedule="schedule"
        class="box"
        @click-group="toggleGroupFilter"
        @click-prefecture="togglePrefectureFilter"
        @click-event="toggleEventTypeFilter"
      />
    </scale-down-transition-group>
    <toggle-panel class="top-margin">
      <template v-slot:button>
        <h2
          class="subtitle"
          style="display: inline;"
        >
          過去のイベント
        </h2>
        <span class="icon">
          <font-awesome-icon icon="angle-down" />
        </span>
      </template>
      <template v-slot:content>
        <scale-down-transition-group>
          <schedule-box
            v-for="schedule in pastSchedules"
            :key="schedule[0].date"
            :schedule="schedule"
            class="box"
            @click-group="toggleGroupFilter"
            @click-prefecture="togglePrefectureFilter"
            @click-event="toggleEventTypeFilter"
          />
        </scale-down-transition-group>
      </template>
    </toggle-panel>
  </div>
</template>
<script>
import { compareDateStr, isPast, getNowDateStr, format } from '@/utils/DateUtil'
import ScheduleFilter from '@/components/ScheduleFilter'
import ScheduleBox from '@/components/ScheduleBox'
import TogglePanel from '@/components/TogglePanel'
import ScaleDownTransitionGroup from '@/components/transitions/ScaleDownTransitionGroup'
const isFuture = date => !isPast(format(date), getNowDateStr())

export default {
  name: 'OfficialSchedule',
  components: { ScheduleFilter, ScheduleBox, TogglePanel, ScaleDownTransitionGroup },
  data: function () {
    return {
      filterState: '',
      groupFilter: [],
      prefectureFilter: [],
      eventTypeFilter: [],
      displayPastSchedules: false
    }
  },
  computed: {
    sorted () {
      const compare = (a, b) => compareDateStr(format(a.date), format(b.date))
      return this.$store.state.public.officialSchedule.akushu.slice().sort(compare)
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
    futureSchedules () {
      return this.schedules.filter(schedule => isFuture(schedule[0].date))
    },
    pastSchedules () {
      return this.schedules.filter(schedule => !isFuture(schedule[0].date)).reverse()
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
    },
    togglePastSchedules () {
      this.displayPastSchedules = !this.displayPastSchedules
    }
  }
}
</script>
<style scoped>
.official-schedule {
  padding: 8px 24px;
}

.box {
  margin-bottom: 12px;
  padding: 8px 12px;
}

.sticky {
  position: sticky;
  top: 60px;
}

.top-margin {
  margin-top: 24px;
}
</style>
