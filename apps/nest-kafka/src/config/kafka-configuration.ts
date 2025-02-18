  export default () => ({
    broker: process.env.KAFKA_BROKER || '',
    clienId: process.env.KAFKA_CLIENT_ID || '',
  })