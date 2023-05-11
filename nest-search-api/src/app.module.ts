import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ElasticModule } from './elastic/elastic.module';
import { ElasticController } from './elastic/elastic.controller';

@Module({
  imports: [ElasticModule],
  controllers: [AppController, ElasticController],
  providers: [AppService],
})
export class AppModule {}
