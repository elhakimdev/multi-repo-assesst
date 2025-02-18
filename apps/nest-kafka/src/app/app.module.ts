import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ConfigModule } from '@nestjs/config';
import { KafkaModule } from '../kafka/service/kafka.module';
import { Module } from '@nestjs/common';
import configuration from '../config/configuration';

@Module({
  imports: [
    KafkaModule,
    ConfigModule.forRoot({
      load: [
        configuration
      ]
    })
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
