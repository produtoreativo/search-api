import { Injectable } from '@nestjs/common';
import { PinoLogger, InjectPinoLogger } from 'nestjs-pino';
import { ElasticsearchService } from '@nestjs/elasticsearch';
// import queryMagento from './query';

@Injectable()
export class ElasticService {
  constructor(
    private readonly elasticClient: ElasticsearchService,
    @InjectPinoLogger(ElasticService.name)
    private readonly logger: PinoLogger,
  ) {}

  async search(terms: string) {
    // const query = queryMagento(terms);
    const response = await this.elasticClient.search({
      index: 'magento2_product_1_v4',
      from: 0,
      size: 12,
      query: {
        bool: {
          must: {
            multi_match: {
              query: terms,
              fields: ['name', 'short_description'],
              operator: 'and',
              type: 'cross_fields',
            },
          },
          // filter: {
          //   term: {
          //     active: true,
          //   },
          // },
        },
      },
      highlight: {
        pre_tags: ['<em class="highlight">'],
        post_tags: ['</em>'],
        fields: {
          name: {},
          short_description: {},
        },
      },
    });

    this.logger.info(response.hits);
    // return response.hits.hits.map((hit: any) => ({
    //   data: hit._source,
    //   highlight: hit.highlight,
    // }));

    return response.hits.hits.map((hit: any) => {
      const { _id, _source: source, highlight } = hit;

      return Object.keys(source).reduce((result, key) => {
        result['id'] = _id;
        result[key] = key in highlight ? highlight[key].join('') : source[key];
        return result;
      }, {});
    });
  }
}
