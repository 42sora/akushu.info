<template>
  <div class="card">
    <header class="card-header">
      <p class="card-header-title">
        {{ event.eventDate }} {{ event.eventPlace }}
      </p>
      <a
        v-if="enableShare"
        class="card-header-icon"
        aria-label="share twitter"
        @click="share"
      >
        <span class="icon is-small">
          <font-awesome-icon :icon="['fab','twitter']" />
        </span>
      </a>
    </header>
    <div class="card-content">
      <aku-table :tickets="event.tickets" />
    </div>
  </div>
</template>
<script>
import AkuTable from '@/components/AkuTable'
export default {
  components: { AkuTable },
  props: {
    event: { type: Object, required: true },
    enableShare: { type: Boolean, default: true }
  },
  methods: {
    async share () {
      const key = process.env.VUE_APP_API_KEY
      const url = `https://akushu.info/share?q=${JSON.stringify(this.event)}`

      const responce = await fetch(`https://firebasedynamiclinks.googleapis.com/v1/shortLinks?key=${key}`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            'dynamicLinkInfo': {
              'domainUriPrefix': 'https://akushu.info/link',
              'link': url
            },
            'suffix': {
              'option': 'SHORT'
            }
          })
        })
      console.debug(responce)

      if (responce.ok) {
        const body = await responce.json()
        console.debug(body)
        const shortLink = body.shortLink
        const text = `${this.event.eventDate}（${this.event.eventPlace}）の握手券枚数`

        window.open(`https://twitter.com/intent/tweet?url=${shortLink}&text=${text}`, '_blank')
      }
    }
  }
}
</script>
