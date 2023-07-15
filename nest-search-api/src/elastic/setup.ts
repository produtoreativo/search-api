import { NestFactory } from '@nestjs/core';
import { ElasticsearchService } from '@nestjs/elasticsearch';
import { AppModule } from '../app.module';

async function createIndex(elasticClient: ElasticsearchService) {
  return elasticClient.indices.create({
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

export async function bootstrap() {
  const app = await NestFactory.createApplicationContext(AppModule);
  const elasticClient = app.get(ElasticsearchService);

  try {
    await createIndex(elasticClient);
    console.log('Index created successfully.');
  } catch (err) {
    console.error('Error creating index:', err.message);
  } finally {
    await app.close();
  }
}
bootstrap();
