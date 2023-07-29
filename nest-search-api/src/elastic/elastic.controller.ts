import { Controller, Get, Query } from '@nestjs/common';
import { ElasticService } from './elastic.service';

@Controller('search')
export class ElasticController {
  constructor(private readonly searchService: ElasticService) {}

  @Get()
  async search(@Query('query') query: string) {
    return this.searchService.search(query);
  }

  @Get('products-list')
  products() {
    return this.searchService.search('coca');
    // return [
    //   {
    //     id: '23',
    //     name: 'Coca cola 600 ml',
    //     price: '3,5',
    //   },
    //   {
    //     id: '33',
    //     name: 'Coca cola 2L',
    //     price: '13,75',
    //   },
    //   {
    //     id: '24',
    //     name: 'Coca Cola 250 ml',
    //     price: '2,75',
    //   },
    //   {
    //     id: '89',
    //     name: 'Coca cola 1,5 L',
    //     price: '9,24',
    //   },
    // ];
  }
}
