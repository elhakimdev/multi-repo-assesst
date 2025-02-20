import { CommandRunnerModule } from "nest-commander";
import { KafkaClientService } from "./service/kafka-client.service";
import { KafkaConsumerCommand } from "./commands/kafka-consumer.command";
import { KafkaProducerCommand } from "./commands/kafka-producer.command";
import { Module } from "@nestjs/common";

@Module({
  imports: [CommandRunnerModule],
  providers: [
    KafkaClientService,
    KafkaConsumerCommand,
    KafkaProducerCommand
  ],
  exports: [
    KafkaClientService,
    KafkaConsumerCommand,
    KafkaProducerCommand
  ]
})
export class KafkaModule {}