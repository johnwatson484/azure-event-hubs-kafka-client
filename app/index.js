(async function () {
  const { EventReceiver, EventSender } = require('./events')
  const config = require('./config')
  const receiver = new EventReceiver(config, (message) => { console.log(message.value.toString()) })
  await receiver.connect()
  await receiver.subscribe()
  console.log('Ready to receive events')
  const sender = new EventSender(config)
  await sender.connect()
  await sender.sendEvents([{ body: `Event from ${config.clientId}`, headers: { routingKey: 'key' } }])
  await sender.closeConnection()

  process.on('SIGINT', async () => {
    await receiver.closeConnection()
  })

  process.on('SIGTERM', async () => {
    await receiver.closeConnection()
  })
}())
