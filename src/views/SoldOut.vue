<template>
  <div class="container">
    <main-nav />
    <section
      v-for="event in events"
      :key="event[0].eventName"
      class="section"
    >
      <div class="container">
        <div
          class="box"
          :class="getTitleClass(event[0].eventName)"
        >
          <h2
            class="subtitle"
          >
            {{ getTitle(event[0].eventName) }}
          </h2>
        </div>
        <div class="sold-out-table">
          <sold-out-table :event="event" />
        </div>
      </div>
    </section>
  </div>
</template>
<script>
import MainNav from '@/components/MainNav'
import SoldOutTable from '@/components/SoldOutTable.vue'
export default {
  name: 'SoldOut',
  components: { MainNav, SoldOutTable },
  computed: {
    origin () {
      return this.$store.state.public.goodsList
    },
    sortKey () {
      return this.$store.state.public.sortKey
    },
    events () {
      const sortKey = this.sortKey.goods.slice().sort((a, b) => a.priority - b.priority).reverse()
      return sortKey.map(key => this.origin[key.groupName][key.goodsName])
    }
  },
  methods: {
    getTitle (eventName) {
      return eventName.split('】')[1].split('発売記念')[0]
    },
    getTitleClass (eventName) {
      return {
        'bk-coler-nogi': eventName.includes('乃木坂'),
        'bk-coler-keyaki': eventName.includes('欅坂'),
        'bk-coler-yoshimoto': eventName.includes('吉本坂'),
        'bk-coler-hinata': eventName.includes('日向坂')
      }
    }
  }
}
</script>
<style>
.sold-out-table {
  overflow-x: auto;
}
</style>
