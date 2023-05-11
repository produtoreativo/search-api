import { Injectable } from '@nestjs/common';
import { ElasticsearchService } from '@nestjs/elasticsearch';

@Injectable()
export class ElasticService {
  constructor(private readonly elasticClient: ElasticsearchService) {}

  async search(query: string) {
    const response = await this.elasticClient.search({
      index: 'products',
      query: {
        bool: {
          must: {
            multi_match: {
              query: query,
              fields: ['name^3', 'description'],
              type: 'phrase_prefix',
            },
          },
          filter: {
            term: {
              active: true,
            },
          },
        },
      },
      highlight: {
        pre_tags: ['<em classname="highlight">'],
        post_tags: ['</em>'],
        fields: {
          name: {},
          description: {},
        },
      },
    });

    // return response.hits.hits.map((hit: any) => ({
    //   data: hit._source,
    //   highlight: hit.highlight,
    // }));
    
    return response.hits.hits.map((hit: any) => {
      const { _source: source, highlight } = hit;
    
      return Object.keys(source).reduce((result, key) => {
        result[key] = key in highlight ? highlight[key].join('') : source[key];
        return result;
      }, {});
    });
  }
}
