<template>
  <div class="home">
    <div class="container">
      <div class="level">
        <div class="level-item container">
          <button
            class="button is-primary is-large has-text-weight-semibold modal-button"
            data-target="modal"
            aria-haspopup="true"
            @click="showFortuneLoginForm"
          >
            forTUNE musicにログイン
          </button>
          <div
            class="modal"
            :class="{'is-active':isFortuneLogin}"
          >
            <div
              class="modal-background"
              @click="hideFortuneLoginForm"
            />
            <div class="modal-content">
              <div class="box">
                <fortune-login-form @login-fortune="startScrapping($event)" />
              </div>
            </div>
          </div>
        </div>
      </div>
      <scraping-progress
        v-if="isScraped"
        class="box"
        :scraping-state="scrapingState"
      />
      <div
        v-else
        class="box"
      >
        <p>
          マイスケジュールを見るには<a @click="showFortuneLoginForm">forTUNE musicへログイン</a>する必要があります。
        </p>
      </div>
      <member-filter
        v-if="members.length>0"
        class="box"
        :members="members"
        @chengedFilter="filter=$event"
      />
      <aku-card
        v-for="event in futureEvtnts"
        :key="event.eventDate"
        :event="event"
      />
      <div
        v-if="pastEvents.length>0"
        class="top-margin"
      >
        <div @click="togglePastEvents">
          <h2
            class="subtitle"
            style="display: inline;"
          >
            過去のイベント
          </h2>
          <span class="icon">
            <font-awesome-icon icon="angle-down" />
          </span>
        </div>
        <template v-if="displayPastEvents">
          <aku-card
            v-for="event in pastEvents"
            :key="event.eventDate"
            :event="event"
          />
        </template>
      </div>
    </div>
  </div>
</template>
<script>
import { isPast } from '@/utils/DateStrComparer'
import { unique } from '@/utils/ArrayUtil'
import AkuCard from '@/components/AkuCard'
import FortuneLoginForm from '@/components/FortuneLoginForm'
import MemberFilter from '@/components/MemberFilter'
import ScrapingProgress from '@/components/ScrapingProgress'

const getNowDateStr = () => {
  const now = new Date()
  const year = now.getFullYear()
  const month = now.getMonth() + 1
  const day = now.getDate()
  return year + '-' + month + '-' + day
}

export default {
  name: 'Home',
  components: { AkuCard, FortuneLoginForm, MemberFilter, ScrapingProgress },
  data: function () {
    return {
      isFortuneLogin: false,
      filter: [],
      displayPastEvents: false
    }
  },
  computed: {
    originEvents () {
      return this.$store.getters.myEventList
    },
    filteredEvents () {
      if (this.filter.length === 0) return this.originEvents
      return this.originEvents
        .map(event => {
          return {
            eventDate: event.eventDate,
            eventPlace: event.eventPlace,
            tickets: event.tickets.filter(ticket =>
              this.filter.includes(ticket.memberName)
            )
          }
        })
        .filter(event => event.tickets.length > 0)
    },
    futureEvtnts () {
      const nowDateStr = getNowDateStr()
      return this.filteredEvents
        .filter(event => !isPast(event.eventDate, nowDateStr))
    },
    pastEvents () {
      const nowDateStr = getNowDateStr()
      return this.filteredEvents
        .filter(event => isPast(event.eventDate, nowDateStr))
        .reverse()
    },
    members () {
      return this.originEvents
        .flatMap(event => event.tickets)
        .map(ticket => ticket.memberName)
        .filter(unique)
    },
    scrapingState () {
      return this.$store.state.user.scrapingState
    },
    isScraped () {
      return Object.keys(this.scrapingState).length > 0
    }
  },
  methods: {
    showFortuneLoginForm () {
      this.isFortuneLogin = true
    },
    hideFortuneLoginForm () {
      this.isFortuneLogin = false
    },
    togglePastEvents () {
      this.displayPastEvents = !this.displayPastEvents
    },
    async startScrapping (event) {
      const startScraping = this.$functions.httpsCallable('startScraping')
      const res = await startScraping({ email: event.email, password: event.password })
      console.log(res)
      this.isFortuneLogin = false
      event.close()
    }
  }
}
</script>
<style scoped>
.top-margin {
  margin-top: 24px;
}
</style>
