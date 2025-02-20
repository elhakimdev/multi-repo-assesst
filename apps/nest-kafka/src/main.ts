/**
 * This is not a production server yet!
 * This is only a minimal backend to get started.
 */

import { AppModule } from './app/app.module';
import { CommandFactory } from 'nest-commander';
import { Logger } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';

async function bootstrap() {
  const app = await NestFactory.create(AppModule, {
    logger: ['error', 'warn', 'log', 'debug', 'verbose'],
  });

  const args = process.argv.slice(2); // Get CLI arguments (e.g., kafka:consume)

  const isRunKafkaCommand = args.length > 0 && args[0].includes('kafka:');
  
  if(isRunKafkaCommand) { 
    await CommandFactory.run(AppModule, {
      logger: ['error', 'warn', 'log', 'debug', 'verbose'],
    });

    return; // exit the application
  }
  

  const globalPrefix = 'api';
  app.setGlobalPrefix(globalPrefix);
  const port = process.env.PORT || 3000;
  await app.listen(port);
  Logger.log(
    `🚀 Application is running on: http://localhost:${port}/${globalPrefix}`
  );
}

bootstrap();
