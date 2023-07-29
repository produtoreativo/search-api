import { Module } from '@nestjs/common';
import { ElasticsearchModule } from '@nestjs/elasticsearch';
import { ElasticService } from './elastic.service';
import { ElasticController } from './elastic.controller';
import { ConfigService } from '@nestjs/config';

@Module({
  imports: [
    ElasticsearchModule.registerAsync({
      useFactory: async (configService: ConfigService) => ({
        node: configService.get('ELASTICSEARCH_URL'),
      }),
      inject: [ConfigService],
    }),
  ],
  providers: [ElasticService],
  controllers: [ElasticController],
  exports: [ElasticService],
})
export class ElasticModule {}
