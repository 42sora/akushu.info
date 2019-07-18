<template>
  <div class="container">
    <template
      v-for="(soldOut,i) in soldOutList"
    >
      <div
        v-if="i<currentDisplayLength"
        :key="soldOut.goodsName"
        class="card"
      >
        <header
          class="card-header"
          :class="getBkColerClass(soldOut.goodsName)"
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
      <div
        v-else
        :key="i"
        class="dummy"
      />
    </template>
  </div>
</template>
<script>
import { getBkColerClass } from '@/utils/StyleUtil'
import SoldOutTable from '@/components/SoldOutTable.vue'
export default {
  name: 'SoldOut',
  components: { SoldOutTable },
  data () {
    return {
      currentDisplayLength: 0
    }
  },
  computed: {
    soldOutList () {
      return this.$store.getters.soldOutList
    }
  },
  mounted () {
    setTimeout(() => {
      this.extendDisplayLength()
    }, 0)
  },
  updated () {
    setTimeout(() => {
      this.extendDisplayLength()
    }, 0)
  },
  methods: {
    extendDisplayLength () {
      if (this.currentDisplayLength < this.soldOutList.length) {
        this.currentDisplayLength++
      }
    },
    getTitle (eventName) {
      return eventName.split('】')[1].split('発売記念')[0]
    },
    getBkColerClass
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

.dummy {
  height: 900px;
}
</style>
