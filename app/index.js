(async function () {
  const events = require('./events')
  await events.subscribe()
}())
