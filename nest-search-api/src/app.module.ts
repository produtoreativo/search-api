import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ElasticModule } from './elastic/elastic.module';
import { ConfigModule } from '@nestjs/config';
import {
  utilities as nestWinstonModuleUtilities,
  WinstonModule,
} from 'nest-winston';
import * as winston from 'winston';
import { ElasticsearchTransport } from 'winston-elasticsearch';

const esTransportOpts = {
  level: 'info',
  clientOpts: { node: process.env.ELASTICSEARCH_URL },
};

@Module({
  imports: [
    ConfigModule.forRoot(),
    WinstonModule.forRoot({
      level: process.env.LOGGER_LEVEL,
      transports: [
        new ElasticsearchTransport(esTransportOpts),
        new winston.transports.Console({
          format: winston.format.combine(
            winston.format.timestamp(),
            nestWinstonModuleUtilities.format.nestLike(),
          ),
        }),
      ],
    }),
    ElasticModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
