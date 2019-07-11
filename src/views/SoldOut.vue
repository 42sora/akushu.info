<template>
  <div class="container">
    <div
      v-for="soldOut in sliced"
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
          <sold-out-table
            :event-name="soldOut.goodsName"
            :events="soldOut.events"
          />
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
  data () {
    return {
      displayLength: 0
    }
  },
  computed: {
    soldOutList () {
      return this.$store.getters.soldOutList
    },
    sliced () {
      return this.soldOutList.slice(0, this.displayLength)
    }
  },
  mounted () {
    setTimeout(() => {
      this.updatedTable()
    }, 0)
  },
  updated () {
    setTimeout(() => {
      this.updatedTable()
    }, 0)
  },
  methods: {
    updatedTable () {
      if (this.displayLength < this.soldOutList.length) {
        this.displayLength++
      }
    },
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
  margin-bottom: 24px;
  width: fit-content;
}

.card-header {
  border-bottom: 2px solid lightgray;
}

.card-content {
  padding: 0;
}

.table-wrapper {
  overflow-x: auto;
}
</style>
