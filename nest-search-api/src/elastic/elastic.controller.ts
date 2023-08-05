import { Controller, Get, Query } from '@nestjs/common';
import { ElasticService } from './elastic.service';

@Controller('search')
export class ElasticController {
  constructor(private readonly searchService: ElasticService) {}

  @Get()
  async search(@Query('query') query: string) {
    return this.searchService.search(query);
  }
}
