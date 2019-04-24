const Twit = require('twit')

const config = {
  consumer_key: process.env.consumer_key,
  consumer_secret: process.env.consumer_secret,
  access_token: process.env.access_token,
  access_token_secret: process.env.access_token_secret,
  timeout_ms: 60 * 1000,
  strictSSL: true
}

const twit = new Twit(config);

// tslint:disable-next-line: no-floating-promises
(async () => {
  try {

    const res = await twit.post('statuses/update', { status: 'hello world!' })
    console.log(res);

  } catch (error) {
    console.error(error)
  }
})()
