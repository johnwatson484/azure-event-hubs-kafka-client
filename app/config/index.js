const { v4: uuidv4 } = require('uuid')

const config = {
  host: process.env.EVENT_HUB_HOST,
  connectionString: process.env.EVENT_HUB_CONNECTION_STRING,
  clientId: process.env.CLIENT_ID || `azure-event-hubs-kafka-client-${uuidv4()}`,
  topic: process.env.EVENT_HUB_TOPIC,
  auth: process.env.EVENT_HUB_AUTH || 'connectionString'
}

module.exports = config
