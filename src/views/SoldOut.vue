<template>
  <div class="container">
    <div
      v-for="soldOut in soldOutList"
      :key="soldOut.goodsName"
      class="card"
    >
      <header
        class="card-header"
        :class="getTitleClass(soldOut.goodsName)"
      >
        <p class="card-header-title">
          {{ getTitle(soldOut.goodsName) }}
        </p>
      </header>
      <div class="card-content">
        <div class="table-wrapper">
          <sold-out-table :events="soldOut.events" />
        </div>
      </div>
    </div>
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
<style scoped>
.card {
  width: fit-content;
}

.card-content {
  padding: 0;
}

.table-wrapper {
  overflow-x: auto;
}
</style>
