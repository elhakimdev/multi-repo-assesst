import { KafkaClientService } from "./kafka-client.service";
import { KafkaConsumerService } from "./kafka-consumer.service";
import { KafkaProducerService } from "./kafka-producer.service";
import { Module } from "@nestjs/common";

@Module({
  providers: [
    KafkaClientService,
    KafkaProducerService,
    KafkaConsumerService
  ],
  exports: [
    KafkaClientService,
    KafkaProducerService,
    KafkaConsumerService
  ]
})
export class KafkaModule {}