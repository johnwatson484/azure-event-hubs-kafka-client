(async function () {
  const events = require('./events')
  await events.subscribe()
  console.log('Ready to receive events')
}())
