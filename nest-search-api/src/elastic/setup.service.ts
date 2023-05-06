import { Injectable } from '@nestjs/common';
import { ElasticsearchService } from '@nestjs/elasticsearch';

@Injectable()
export class SetupService {
  constructor(private readonly elasticClient: ElasticsearchService) {}
  async createIndex() {
    return this.elasticClient.indices.create({
      index: 'products',
      mappings: {
        properties: {
          name: {
            type: 'text',
          },
          description: {
            type: 'text',
          },
          active: {
            type: 'boolean',
          },
        },
      },
    });
  }
}
