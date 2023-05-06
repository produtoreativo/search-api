import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ElasticModule } from './elastic/elastic.module';

@Module({
  imports: [ElasticModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
