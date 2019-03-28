<template>
  <div class="home">
    <p @click="signOut">logout</p>
    <div>
      <p>fortune music</p>
      <p>メールアドレス</p>
      <input type="text" v-model="fortune.email">
      <p>パスワード</p>
      <input type="password" v-model="fortune.password">
      <p @click="startScrapping">login</p>
    </div>
    <template v-for="name in members">
      <input type="checkbox" :value="name" :key="name" v-model="filterChecks">
      {{name}}
    </template>
    <div v-for="event in filterd" :key="event.eventDate">
      <p>{{event.eventDate}} {{event.eventPlace}}</p>
      <aku-table :tickets="event.tickets"></aku-table>
    </div>
  </div>
</template>

<script>
import AkuTable from '@/components/AkuTable'
import firebase from 'firebase'

export default {
  name: 'home',
  components: { AkuTable },
  data: function () {
    return {
      filterChecks: [],
      fortune: {
        name: '',
        password: ''
      }
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
    filterd () {
      if (this.filterChecks.length === 0) return this.origin
      return this.origin
        .map(event => {
          return {
            eventDate: event.eventDate,
            eventPlace: event.eventPlace,
            tickets: event.tickets.filter(ticket =>
              this.filterChecks.includes(ticket.memberName)
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
  methods: {
    async signOut () {
      await firebase.auth().signOut()
      this.$router.push('/signin')
    },
    async startScrapping () {
      const email = this.fortune.email
      if (!email) {
        alert('メールアドレスを入力してください。')
        return
      }

      const password = this.fortune.password
      if (!password) {
        alert('パスワードを入力してください。')
        return
      }
      const startScraping = firebase.app().functions('asia-northeast1').httpsCallable('startScraping')
      const res = await startScraping({ email, password })
      console.log(res)
    }
  },
  created () {
    const db = firebase.firestore()
    const userCompletion = db.collection('users')
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
  }
}
</script>
<style>
td {
  text-align: center;
}
</style>
