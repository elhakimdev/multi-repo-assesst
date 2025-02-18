import { Inject, Injectable, OnApplicationShutdown, OnModuleInit } from "@nestjs/common";
import { KafkaClientService } from "./kafka-client.service";
@Injectable()
export class KafkaProducerService implements OnModuleInit, OnApplicationShutdown  {
  constructor(
    @Inject() private readonly kafkaClientService: KafkaClientService
  ){}
  async onModuleInit() {
    try {
      
      const producer = this.kafkaClientService.getProducer();
      await producer.connect();
    } catch (error) {
      
    }
  }
  async onApplicationShutdown() {
    this.kafkaClientService.getProducer().disconnect();
  }
}
