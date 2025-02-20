import { AppController } from './app.controller';
import { AppService } from './app.service';
import { CommandRunnerModule } from 'nest-commander';
import { ConfigModule } from '@nestjs/config';
import { KafkaModule } from '../kafka/kafka.module';
import { Module } from '@nestjs/common';
import configuration from '../config/configuration';

@Module({
  imports: [
    CommandRunnerModule,
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
