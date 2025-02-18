import {Consumer, ConsumerConfig, Kafka, Producer, ProducerConfig, logLevel} from 'kafkajs';

import { Injectable } from "@nestjs/common";

@Injectable()
export class KafkaClientService {

  private readonly kafka: Kafka = new Kafka({
    brokers: ['0.0.0.0:29092'],
    clientId: 'kafka-client-nest',
    logLevel: logLevel.DEBUG,
  });

  getProducer(config?: ProducerConfig): Producer {
    return this.kafka.producer(config);
  }

  getConsumer(config: ConsumerConfig): Consumer {
    return this.kafka.consumer(config);
  }
}