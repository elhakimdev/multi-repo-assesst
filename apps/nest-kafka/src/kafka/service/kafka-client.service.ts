import {Consumer, ConsumerConfig, Kafka, Producer, ProducerConfig} from 'kafkajs';

import { Injectable } from "@nestjs/common";
import kafkaConfiguration from '../../config/kafka-configuration';

@Injectable()
export class KafkaClientService {

  private readonly kafkaConfig = kafkaConfiguration()

  private readonly kafka: Kafka = new Kafka({
    brokers: [this.kafkaConfig.broker],
    clientId: this.kafkaConfig.clientId,
  });

  getProducer(config?: ProducerConfig): Producer {
    return this.kafka.producer(config);
  }

  getConsumer(config: ConsumerConfig): Consumer {
    return this.kafka.consumer(config);
  }
}