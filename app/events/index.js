const config = require('../config')
const { Kafka, logLevel } = require('kafkajs')
const { DefaultAzureCredential } = require('@azure/identity')
let consumer

const getConnectionStringCredentials = () => {
  return {
    ssl: true,
    sasl: {
      mechanism: 'plain',
      username: '$ConnectionString',
      password: config.connectionString
    }
  }
}

const getTokenCredentials = () => {
  return {
    ssl: true,
    sasl: {
      mechanism: 'oauthbearer',
      oauthBearerProvider: async () => {
        const credential = new DefaultAzureCredential()
        const accessToken = await credential.getToken([`https://${config.host}.servicebus.windows.net`])
        return { value: accessToken.token }
      }
    }
  }
}

const getCredentials = () => {
  switch (config.auth) {
    case 'connectionString':
      return getConnectionStringCredentials()
    case 'token':
      return getTokenCredentials()
    default:
      return {}
  }
}

const credentials = getCredentials(config.auth)

const kafka = new Kafka({
  logLevel: logLevel.ERROR,
  brokers: [`${config.host}:9093`],
  clientId: config.clientId,
  ...credentials
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
