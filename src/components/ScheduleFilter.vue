<template>
  <div>
    <button
      v-if="isClose"
      class="button is-white is-fullwidth"
      @click="displayFilter=!displayFilter"
    >
      <span>絞り込む</span>
      <span class="icon">
        <font-awesome-icon icon="angle-down" />
      </span>
    </button>
    <div :class="{'inline':isMinimum}">
      <button
        v-for="group in filteredGroups"
        :key="group"
        class="button item"
        :class="groupFilter.includes(group)?getBkColerClass(group):{}"
        @click="$emit('click-group',group)"
      >
        {{ group }}
      </button>
    </div>
    <div :class="{'inline':isMinimum}">
      <template v-if="isFull">
        <button
          v-for="(group, name) in prefectureGroup"
          :key="name"
          class="button item"
          :class="group.every(it => prefectureFilter.includes(it))?getBkColerClass(name):{}"
          @click="tapPrefectureGroup(group)"
        >
          {{ name }}
        </button>
      </template>
      <button
        v-for="prefecture in filteredPrefectures"
        :key="prefecture"
        class="button item"
        :class="prefectureFilter.includes(prefecture)?getBkColerClass(prefecture):{}"
        @click="$emit('click-prefecture',prefecture)"
      >
        {{ prefecture }}
      </button>
    </div>
    <div :class="{'inline':isMinimum}">
      <button
        v-for="eventType in filteredEventTypes"
        :key="eventType"
        class="button item"
        :class="eventTypeFilter.includes(eventType)?getBkColerClass(eventType):{}"
        @click="$emit('click-event',eventType)"
      >
        {{ eventType }}
      </button>
    </div>
    <button
      v-if="isFull"
      class="button is-white is-fullwidth"
      @click="displayFilter=!displayFilter"
    >
      <span class="icon">
        <font-awesome-icon icon="angle-double-up" />
      </span>
    </button>
    <button
      v-if="isMinimum"
      class="button is-white is-fullwidth"
      @click="displayFilter=!displayFilter"
    >
      <span class="icon">
        <font-awesome-icon icon="angle-down" />
      </span>
    </button>
  </div>
</template>
<script>
import { getBkColerClass } from '@/utils/StyleUtil'
const sortSameAsMaster = master => (a, b) => master.indexOf(a) - master.indexOf(b)
export default {
  props: {
    groupFilter: { type: Array, required: true },
    prefectureFilter: { type: Array, required: true },
    eventTypeFilter: { type: Array, required: true }
  },
  data: function () {
    return {
      displayFilter: false,
      allGroups: [ '乃木坂46', '欅坂46', '日向坂46', '吉本坂46' ],
      prefectureGroup: { '関東': ['千葉', '東京', '神奈川'], '関西': ['京都', '大阪'] },
      prefectures: ['宮城', '千葉', '東京', '神奈川', '愛知', '京都', '大阪'],
      eventTypes: ['個別握手会', '全国握手会']
    }
  },
  computed: {
    filteredGroups () {
      return this.displayFilter ? this.allGroups : this.groupFilter.slice().sort(sortSameAsMaster(this.allGroups))
    },
    filteredPrefectures () {
      return this.displayFilter ? this.prefectures : this.prefectureFilter.slice().sort(sortSameAsMaster(this.prefectures))
    },
    filteredEventTypes () {
      return this.displayFilter ? this.eventTypes : this.eventTypeFilter.slice().sort(sortSameAsMaster(this.eventTypes))
    },
    state () {
      if (this.displayFilter) {
        return 'full'
      } else if (this.groupFilter.length > 0 || this.prefectureFilter.length > 0 || this.eventTypeFilter.length > 0) {
        return 'minimum'
      } else {
        return 'close'
      }
    },
    isFull () {
      return this.state === 'full'
    },
    isMinimum () {
      return this.state === 'minimum'
    },
    isClose () {
      return this.state === 'close'
    }
  },
  watch: {
    state (value) {
      this.$emit('chenge-state', value)
    }
  },
  created () {
    this.$emit('chenge-state', this.state)
  },
  methods: {
    getBkColerClass,
    tapPrefectureGroup (prefectureGroup) {
      if (prefectureGroup.every(it => this.prefectureFilter.includes(it))) {
        prefectureGroup.forEach(it => this.$emit('click-prefecture', it))
      } else {
        prefectureGroup.filter(it => !this.prefectureFilter.includes(it))
          .forEach(it => this.$emit('click-prefecture', it))
      }
    }
  }
}
</script>
<style scoped>
.inline {
  display: inline;
}

.item {
  display: inline-block;
  padding: 4px 8px;
  margin-right: 4px;
  margin-bottom: 4px;
  border: solid #4a4a4a 1px;
  border-radius: 16px;
}

</style>
