<template>
  <div>
    <div class="buttons">
      <a
        v-for="selectedName in filter"
        :key="selectedName"
        class="button is-info is-small is-outlined is-rounded"
        @click="toggleFilter(selectedName)"
      >
        <span>{{ selectedName }}</span>
        <span class="icon is-small">
          <i class="fas fa-times" />
        </span>
      </a>
    </div>
    <div class="dropdown is-hoverable">
      <div class="dropdown-trigger">
        <button
          class="button"
          aria-haspopup="true"
          aria-controls="dropdown-menu"
        >
          <!-- @click="isActive=!isActive" -->
          <span>メンバーで絞り込む</span>
          <span class="icon is-small">
            <i
              class="fas fa-angle-down"
              aria-hidden="true"
            />
          </span>
        </button>
      </div>
      <div
        id="dropdown-menu"
        class="dropdown-menu"
        role="menu"
      >
        <div class="dropdown-content">
          <a
            v-for="name in members"
            :key="name"
            class="dropdown-item"
            :class="{'is-active':filter.includes(name)}"
            @click="toggleFilter(name)"
          >
            {{ name }}
          </a>
        </div>
      </div>
    </div>
    <a
      class="button"
      @click="filter=[]"
    >
      <span class="icon is-small">
        <i class="fas fa-times" />
      </span>
    </a>
  </div>
</template>
<script>
export default {
  props: {
    members: { type: Array, required: true }
  },
  data () {
    return {
      filter: []
    }
  },
  watch: {
    filter () {
      this.$emit('chengedFilter', this.filter)
    }
  },
  methods: {
    toggleFilter (name) {
      if (this.filter.includes(name)) {
        this.filter = this.filter.filter(x => x !== name)
      } else {
        this.filter.push(name)
      }
    }
  }
}
</script>
