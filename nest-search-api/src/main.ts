import * as dotenv from 'dotenv';
dotenv.config({ path: process.env.DOTENV_PATH || undefined });

import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  await app.listen(3000);
}
bootstrap();
