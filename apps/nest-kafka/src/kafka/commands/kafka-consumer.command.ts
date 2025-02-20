import { Command, CommandRunner, Option } from "nest-commander";
import { Injectable, Logger } from "@nestjs/common";

import { Consumer } from "kafkajs";
import { KafkaClientService } from "../service/kafka-client.service";

interface ConsumerOptions {
  topic?: string;
  groupId?: string;
}

@Injectable()
@Command({
  name: 'kafka:consume',
  description: 'Consume any message to a specified Kafka topic',
})
export class KafkaConsumerCommand extends CommandRunner {

  static displayName = 'Kafka Consumer Command';

  private readonly logger = new Logger(KafkaConsumerCommand.displayName);
  
  constructor(
    private readonly kafkaClientService: KafkaClientService,
  ) {
    super();
  }
  
  async run(passedParams: string[], options?: ConsumerOptions): Promise<void> {
    try {

      let topic = options?.topic || process.env.KAFKA_TOPIC || 'nest-kafka';

      if (!topic) {
        this.logger.error('❌ No topic provided. Exiting...');
        return;
      }

      this.logger.log(`Starting Kafka consumer...`);
  
      const consumer = this.kafkaClientService.getConsumer({
        groupId: options?.groupId || process.env.KAFKA_GROUP_ID || 'nest-kafka-group',
      });
  
      this.logger.log(`Initialize kafka consumer with groupId: ${options?.groupId || process.env.KAFKA_GROUP_ID || 'nest-kafka-group'}`);
  
      this.logger.log(`Connecting to Kafka broker...`);
      
      await consumer.connect();
      
      this.logger.log(`Kafka consumer subscribing topic: ${topic}`);
      
      await consumer.subscribe({ topic, fromBeginning: true });
  
      this.logger.log(`Listening for messages on topic: ${topic}...`);

      this.shutDown(consumer);

      await consumer.run({
        eachMessage: async ({ topic, partition, message }) => {
          this.logger.log(
            `Received message -> Topic: ${topic}, Partition: ${partition}, Offset: ${message.offset}}`
          );

          const rawMessage = message?.value?.toString();
          const normalizedMessage = this.parse(rawMessage);
          this.logger.log(normalizedMessage);
        },
      });
    } catch (error) {
      this.logger.error(`Error consuming message: ${error}`);
    }
  }

  protected parse(value?: string): any {
    if (!value) return '⚠️ No message content';
    try {
      return JSON.parse(value);
    } catch {
      return `📝 Plain Text: ${value}`;
    }
  }

  protected shutDown(consumer: Consumer): void {
    const shutdownHandler = async () => {
      this.logger.log('🔴 Shutting down Kafka consumer gracefully...');
      await consumer.disconnect();
      this.logger.log('✅ Kafka consumer disconnected successfully.');
      process.exit(0);
    };

    process.on('SIGINT', shutdownHandler);
    process.on('SIGTERM', shutdownHandler);
    process.on('uncaughtException', async (error) => {
      this.logger.error(`❌ Uncaught Exception: ${error.message}`);
      await shutdownHandler();
      process.exit(1);
    });
  }

  @Option({
    flags: '--topic <topic>',
    description: 'Kafka topic to send the message to',
  })
  parseTopic(val: string): string {
    return val;
  }
}