<template>
  <div class="home">
    <div class="container">
      <nav
        class="navbar"
        role="navigation"
        aria-label="main navigation"
      >
        <div class="navbar-brand">
          <a
            class="navbar-item"
            @click="this.$router.push('/')"
          >
            <img
              src="../assets/logo.png"
              width="112"
              height="28"
            >
          </a>
          <a
            role="button"
            class="navbar-burger burger"
            aria-label="menu"
            aria-expanded="false"
            :class="{'is-active':menuIsActive}"
            @click="menuIsActive=!menuIsActive"
          >
            <span aria-hidden="true" />
            <span aria-hidden="true" />
            <span aria-hidden="true" />
          </a>
        </div>
        <div
          class="navbar-menu"
          :class="{'is-active':menuIsActive}"
        >
          <div class="navbar-end">
            <div class="navbar-item">
              <div class="buttons">
                <a
                  class="button is-light"
                  @click="signOut"
                >ログアウト</a>
              </div>
            </div>
          </div>
        </div>
      </nav>
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
      <MemberFilter
        class="box"
        :members="members"
        @chengedFilter="filter=$event"
      />
      <div
        v-for="event in filtered"
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
import AkuTable from '@/components/AkuTable'
import FortuneLoginForm from '@/components/FortuneLoginForm'
import MemberFilter from '@/components/MemberFilter'

export default {
  name: 'Home',
  components: { AkuTable, FortuneLoginForm, MemberFilter },
  data: function () {
    return {
      menuIsActive: false,
      isFortuneLogin: false,
      filter: []
    }
  },
  computed: {
    user () {
      return this.$store.state.user
    },
    origin () {
      const compare = (a, b) => {
        if (a === b) { return 0 }
        const splitedA = a.split('-').map(x => parseInt(x, 10))
        const splitedB = b.split('-').map(x => parseInt(x, 10))
        if (splitedA[0] < splitedB[0] ||
        (splitedA[0] === splitedB[0] && splitedA[1] < splitedB[1]) ||
        (splitedA[0] === splitedB[0] && splitedA[1] === splitedB[1] && splitedA[2] < splitedB[2])) {
          return -1
        } else {
          return 1
        }
      }
      return this.$store.state.fortune
        .slice()
        .sort((a, b) => compare(a.eventDate, b.eventDate))
        .reverse()
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
    members () {
      return this.origin
        .flatMap(event => event.tickets.map(x => x.memberName))
        .filter((x, i, self) => self.indexOf(x) === i)
    }
  },
  created () {
    const userCompletion = this.$firestore.collection('users')
      .doc(this.user.uid)
      .onSnapshot(snapshot => {
        console.log(snapshot)
        const data = snapshot.data()
        if (!data) { return }

        const fortune = data.fortuneAggregateData
        this.$store.commit('setFortune', fortune)
      })

    this.$once('hook:beforeDestroy', () => {
      userCompletion()
    })
  },
  methods: {
    async signOut () {
      await this.$auth.signOut()
      this.$store.commit('signOut')
      this.$router.push('/signin')
    },
    async startScrapping (event) {
      const startScraping = this.$functions.httpsCallable('startScraping')
      const res = await startScraping({ email: event.email, password: event.password })
      console.log(res)
      this.isFortuneLogin = false
    }
  }
}
</script>
<style>
</style>
