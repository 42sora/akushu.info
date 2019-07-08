<template>
  <div>
    <h2 class="subtitle has-text-weight-bold">
      {{ schedule[0].date }}
    </h2>
    <div
      v-for="(item, index) in schedule"
      :key="item.goodsName"
    >
      <div
        class="item"
        :class="getBkColerClass(item.groupName)"
        @click="$emit('click-group',item.groupName)"
      >
        {{ item.groupName }} {{ item.goodsNumber }}
        <span class="is-hidden-mobile">「{{ item.goodsName }}」</span>
      </div>
      <div
        class="item"
        :class="getBkColerClass(item.place)"
        @click="$emit('click-prefecture',item.place.split(':')[0])"
      >
        {{ item.place }}
      </div>
      <div
        class="item"
        :class="getBkColerClass(item.eventType)"
        @click="$emit('click-event',item.eventType)"
      >
        {{ item.eventType }}
      </div>
      <div
        v-if="index!==schedule.length-1"
        class="separator"
      />
    </div>
  </div>
</template>
<script>
import { getBkColerClass } from '@/utils/StyleUtil'
export default {
  props: {
    schedule: { type: Array, required: true }
  },
  methods: {
    getBkColerClass
  }
}
</script>
<style scoped>
.subtitle {
  margin-bottom: 8px;
}

.item {
  display: inline-block;
  padding: 4px 8px;
  margin-right: 4px;
  margin-bottom: 4px;
  border: solid #4a4a4a 1px;
  border-radius: 16px;
}

.separator {
  margin-top: 6px;
  margin-bottom: 8px;
  border-bottom: solid lightgray 2px;
}
</style>
