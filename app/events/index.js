const config = require('../config')
const { Kafka, logLevel } = require('kafkajs')
let consumer

const kafka = new Kafka({
  logLevel: logLevel.ERROR,
  brokers: [`${config.host}:9093`],
  clientId: config.clientId,
  ssl: true,
  sasl: {
    mechanism: 'plain',
    username: '$ConnectionString',
    password: config.connectionString
  }
})

const subscribe = async () => {
  consumer = kafka.consumer({ groupId: config.clientId })
  await consumer.connect()
  await consumer.subscribe({ topic: config.topic, fromBeginning: true })
  await consumer.run({
    eachMessage: async ({ topic, partition, message }) => {
      console.log({
        partition,
        offset: message.offset,
        value: message.value.toString()
      })
    }
  })
}

const stop = async () => {
  await consumer.disconnect()
}

process.on('SIGINT', async () => {
  await consumer.disconnect()
})

process.on('SIGTERM', async () => {
  await consumer.disconnect()
})

module.exports = {
  subscribe, stop
}
