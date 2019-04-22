<template>
  <div class="home">
    <div class="container">
      <main-nav />
      <div class="level">
        <div class="level-item container">
          <button
            class="button is-primary is-large has-text-weight-semibold modal-button"
            data-target="modal"
            aria-haspopup="true"
            @click="isFortuneLogin=true"
          >
            forTUNE musicにログイン
          </button>
          <div
            class="modal"
            :class="{'is-active':isFortuneLogin}"
          >
            <div
              class="modal-background"
              @click="isFortuneLogin=false"
            />
            <div class="modal-content">
              <div class="box">
                <fortune-login-form @login-fortune="startScrapping($event)" />
              </div>
            </div>
          </div>
        </div>
      </div>
      <member-filter
        v-if="members.length>0"
        class="box"
        :members="members"
        @chengedFilter="filter=$event"
      />
      <div
        v-for="event in futureEvtnts"
        :key="event.eventDate"
        class="card"
      >
        <header class="card-header">
          <p class="card-header-title">
            {{ event.eventDate }} {{ event.eventPlace }}
          </p>
        </header>
        <div class="card-content">
          <aku-table :tickets="event.tickets" />
        </div>
      </div>
      <div
        v-if="pastEvents.length>0"
        class="top-margin"
      >
        <h2 class="subtitle">
          過去のイベント
        </h2>
      </div>
      <div
        v-for="event in pastEvents"
        :key="event.eventDate"
        class="card"
      >
        <header class="card-header">
          <p class="card-header-title">
            {{ event.eventDate }} {{ event.eventPlace }}
          </p>
        </header>
        <div class="card-content">
          <aku-table :tickets="event.tickets" />
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { isPast } from '@/utils/DateStrComparer'
import MainNav from '@/components/MainNav'
import AkuTable from '@/components/AkuTable'
import FortuneLoginForm from '@/components/FortuneLoginForm'
import MemberFilter from '@/components/MemberFilter'

const getNowDateStr = () => {
  const now = new Date()
  const year = now.getFullYear()
  const month = now.getMonth() + 1
  const day = now.getDate()
  return year + '-' + month + '-' + day
}

export default {
  name: 'Home',
  components: { MainNav, AkuTable, FortuneLoginForm, MemberFilter },
  data: function () {
    return {
      isFortuneLogin: false,
      filter: []
    }
  },
  computed: {
    origin () {
      return this.$store.getters.myEventList
    },
    filtered () {
      if (this.filter.length === 0) return this.origin
      return this.origin
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
      return this.filtered
        .filter(event => !isPast(event.eventDate, nowDateStr))
    },
    pastEvents () {
      const nowDateStr = getNowDateStr()
      return this.filtered
        .filter(event => isPast(event.eventDate, nowDateStr))
        .reverse()
    },
    members () {
      return this.origin
        .flatMap(event => event.tickets.map(x => x.memberName))
        .filter((x, i, self) => self.indexOf(x) === i)
    }
  },
  methods: {
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
<style>
.top-margin{
  margin: 24px auto auto auto;
}
</style>
