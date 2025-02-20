export default () => ({
  broker: process.env.KAFKA_BROKER || '0.0.0.0:29092',
  clientId: process.env.KAFKA_CLIENT_ID || 'kafka-client-nest',
  topic: process.env.KAFKA_TOPIC || 'nest-kafka',
  groupId: process.env.KAFKA_GROUP_ID || 'nest-kafka-group',
});