import { Module } from '@nestjs/common';
import { LoggerModule } from 'nestjs-pino';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ElasticModule } from './elastic/elastic.module';
import { ConfigModule } from '@nestjs/config';

@Module({
  imports: [
    LoggerModule.forRoot(),
    ConfigModule.forRoot({
      isGlobal: true,
      ignoreEnvFile: false,
    }),
    ElasticModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
