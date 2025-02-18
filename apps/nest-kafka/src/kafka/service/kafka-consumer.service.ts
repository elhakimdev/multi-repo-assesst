import { Inject, Injectable, OnApplicationShutdown, OnModuleInit } from "@nestjs/common";
import { KafkaClientService } from "./kafka-client.service";
import { Consumer } from "kafkajs";

@Injectable()
export class KafkaConsumerService implements OnModuleInit, OnApplicationShutdown {

  protected consumers: Consumer[] = [];

  constructor(
    @Inject() private readonly kafkaClientService: KafkaClientService
  ) {}
  
  async onModuleInit() {
    try {
      const consumer = this.kafkaClientService.getConsumer({
        groupId:'web-c1e626aa-e666-41db-b102-a0055b9c18b9'
      });
  
  
      await consumer.connect();
      console.log("KafkaConsumerService initialized");
      console.log("KafkaConsumerService: Connection successfuly established");

      await consumer.subscribe({ topic: 'test-topic', fromBeginning: true });

      console.log("KafkaConsumerService: Subscribed to topic 'test-topic'");
      // Start consuming messages
      await consumer.run({
        eachMessage: async ({ topic, partition, message }) => {
          // Log the received message
          console.log({
            value: message.value ? message.value.toString() : null,
            topic,
            partition,
          });
        },
      });

    } catch (error) {
      console.error(error);
    }
  }

  onApplicationShutdown() {
    for(const consumer of this.consumers) {
      consumer.disconnect()
        .then((connection) => {
          console.log("KafkaConsumerService shutdown");
          console.log("Connection successfuly disconnected", {connection})
        })
        .catch((e) => { console.error(e) });
    }
  }
}
