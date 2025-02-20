import * as fs from 'fs';
import * as readline from 'readline';

import { Command, CommandRunner, Option } from 'nest-commander';
import { Injectable, Logger } from '@nestjs/common';

import { KafkaClientService } from '../service/kafka-client.service';
import { Producer } from 'kafkajs';

interface ProducerOptions {
  topic?: string;
  message?: string;
  file?: string;
}

@Injectable()
@Command({
  name: 'kafka:produce',
  description: 'Send a message to a specified Kafka topic',
})
export class KafkaProducerCommand extends CommandRunner {

  static displayName = 'Kafka Producer Command';

  private readonly logger = new Logger(KafkaProducerCommand.displayName);
  private rl: readline.Interface | null = null;
  private producer: Producer | null = null;

  constructor(private readonly kafkaClientService: KafkaClientService) {
    super();
  }

  async run(passedParams: string[], options?: ProducerOptions): Promise<void> {
    let topic = options?.topic!;


    if (!topic) {
      topic = await this.prompTopic() as string;
      if (!topic) {
        this.logger.error('❌ No topic provided. Exiting...');
        return;
      }
    }

    this.logger.debug(`Initialize kafka produce with groupId: ${options?.topic || process.env.KAFKA_TOPI || 'nest-kafka-topic'}`);
    this.producer = this.kafkaClientService.getProducer();

    this.logger.debug(`Connecting to Kafka broker...`);
    await this.producer?.connect();
    
    if (options?.file) {
      await this.processFile(topic, options.file);
    } else {
      await this.processInteractive(topic);
    }
  }

  async processFile(topic: string, filePath: string) {
    try {
      const content = fs.readFileSync(filePath, 'utf8');
      this.logger.log(`📄 Reading file content from ${filePath}...`);
      this.logger.log(content);
      await this.producer?.send({
        topic,
        messages: [{ value: content }],
      });
      this.logger.log(`✅ File content sent successfully.`);
    } catch (error) {
      this.logger.error(`❌ Failed to read file: ${error}`);
      await this.shutdown();
    } finally {
      await this.shutdown();
    }
  }

  async processInteractive(topic: string) {
    this.logger.log(`⌨️ Enter messages (Press Ctrl + C to exit):`);

    this.rl = readline.createInterface({
      input: process.stdin,
      output: process.stdout,
    });

    this.rl.on('line', async (line) => {
      if (line.trim()) {
        await this.producer?.send({ topic, messages: [{ value: line }] });
        this.logger.log(`✅ Sent: ${line}`);
      }
    });

    this.rl.on('close', async () => {
      this.logger.log(`🛑 Interactive mode exited.`);
      await this.shutdown();
    });
  }


  protected async prompTopic(): Promise<string | null> {
    return new Promise((resolve) => {
      this.rl = readline.createInterface({
        input: process.stdin,
        output: process.stdout,
      });

      this.rl.question('📌 Enter Kafka topic: ', (answer) => {
        this.rl?.close();
        resolve(answer.trim() || null);
      });
    });
  }

  protected shutdown() {
    const shutdownHandler = async () => {
      this.logger.log('🔴 Shutting down Kafka producer gracefully...');
      await this.gracefullShutdown();
      process.exit(0);
    };

    process.on('SIGINT', shutdownHandler);
    process.on('SIGTERM', shutdownHandler);
    process.on('uncaughtException', async (error) => {
      this.logger.error(`❌ Uncaught Exception: ${error.message}`);
      await this.gracefullShutdown();
      process.exit(1);
    });
  }

  protected async gracefullShutdown() {
    try {
      this.rl?.close();
      if (this.producer) {
        await this.producer.disconnect();
      }
      this.logger.log('✅ Kafka producer disconnected successfully.');
    } catch (error) {
      this.logger.error(`❌ Error during shutdown: ${error}`);
    }
  }

  @Option({
    flags: '--topic <topic>',
    description: 'Kafka topic to send the message to',
  })
  parseTopic(val: string): string {
    return val;
  }

  @Option({
    flags: '--message <message>',
    description: 'Message to send to Kafka',
  })
  parseMessage(val: string): string {
    return val;
  }

  @Option({
    flags: '--file <path>',
    description: 'Resource filepath to send using Kafka',
  })
  parseFile(val: string): string {
    return val;
  }
}
