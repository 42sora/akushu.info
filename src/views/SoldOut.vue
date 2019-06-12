<template>
  <div class="container">
    <section
      v-for="soldOut in soldOutList"
      :key="soldOut.goodsName"
      class="section"
    >
      <div class="container">
        <div
          class="box"
          :class="getTitleClass(soldOut.goodsName)"
        >
          <h2
            class="subtitle"
          >
            {{ getTitle(soldOut.goodsName) }}
          </h2>
        </div>
        <div class="sold-out-table">
          <sold-out-table :events="soldOut.events" />
        </div>
      </div>
    </section>
  </div>
</template>
<script>
import SoldOutTable from '@/components/SoldOutTable.vue'
export default {
  name: 'SoldOut',
  components: { SoldOutTable },
  computed: {
    soldOutList () {
      return this.$store.getters.soldOutList
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
