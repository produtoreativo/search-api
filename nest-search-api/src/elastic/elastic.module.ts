import { Module } from '@nestjs/common';
import { ElasticsearchModule } from '@nestjs/elasticsearch';
import { ElasticService } from './elastic.service';
import { ElasticController } from './elastic.controller';

@Module({
  imports: [
    ElasticsearchModule.register({
      node: process.env.ELASTICSEARCH_URL,
    }),
  ],
  providers: [ElasticService],
  controllers: [ElasticController],
  exports: [ElasticService],
})
export class ElasticModule {}
