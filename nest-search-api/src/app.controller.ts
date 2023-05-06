import { Controller, Get } from '@nestjs/common';
import { SetupService } from './elastic/setup.service';

@Controller()
export class AppController {
  constructor(private readonly setupService: SetupService) {}

  @Get()
  createIndex() {
    return this.setupService.createIndex();
  }
}
