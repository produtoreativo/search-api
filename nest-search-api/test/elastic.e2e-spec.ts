import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
//import { AppModule } from './../src/app.module';
import { ElasticModule } from './../src/elastic/elastic.module';
import { Client } from '@elastic/elasticsearch';
//import { ConfigModule } from '@nestjs/config';
import * as dotenv from "dotenv";

describe('ElasticController (e2e)', () => {
  let app: INestApplication;

  const connectionString = process.env.ELASTICSEARCH_URL || 'http://localhost:9200/';
  const client = new Client({ node: connectionString });

	beforeAll(async () => {
    dotenv.config();
    await client.indices.delete({
        ignore_unavailable: true,
        index: 'products'
      });

    await client.indices.create(
      { "index": 'products', 
        "mappings": {
          "properties": {
            "name": {
              "type": "text"
            },
            "description": {
              "type": "text"
            },
            "active": {
              "type": "boolean"
            }
          }
        }
      });

      // POST /products/_bulk
      // { "index" : { "_index" : "products" } }
      // { "name": "Coca-Cola 600ml", "description": "Product Description", "active": true }
      // { "index" : { "_index" : "products" } }
      // { "name": "Coca Cola", "description": "Size: 600 ml", "active": true }
      // { "index" : { "_index" : "products" } }
      // { "name": "Soda", "description": "Cocacola 600", "active": true }

    const lista = [
      { "id": '1', 
        "name": "Coca-Cola 600ml", 
        "description": "Product Description", 
        "active": true },

      { "id": '2', 
        "name": "Coca Cola ", 
        "description": "600ml", 
        "active": true },

      { "id": '3', 
      "name": "Pepsi Cola ", 
      "description": "600ml", 
      "active": true },

      { "id": '4', 
      "name": "51", 
      "description": "1600 ml", 
      "active": true },

      { "id": '5', 
      "name": "Coccacola", 
      "description": "1 litro", 
      "active": true },

      { "id": '6', 
      "name": "Coca Cola ", 
      "description": "600ml", 
      "active": false }

    ];

    const operations = lista.flatMap(doc => [{ index: { _index: 'products' } }, doc])
    const bulkResponse = await client.bulk({ refresh: "wait_for", operations })

  });

  afterAll(async () => { 
    await client.indices.delete({ index: 'products' });
  });

  beforeEach(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [ElasticModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();
  });

  it('/search (GET)', () => {
    return request(app.getHttpServer())
      .get('/search')
      .query({ query: 'coca cola 600ml' })
      .expect(200)
      .expect(
        [
          {
            id: '2',
            name: '<em classname="highlight">Coca</em> <em classname="highlight">Cola</em>',
            description: '<em classname="highlight">600ml</em>',
            active: true
          },
          {
            id: '1',
            name: '<em classname="highlight">Coca</em>-<em classname="highlight">Cola</em> <em classname="highlight">600ml</em>',
            description: 'Product Description',
            active: true
          }
        ]
      );
  });
});


