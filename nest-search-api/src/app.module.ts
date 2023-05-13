import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ElasticModule } from './elastic/elastic.module';
import { ElasticController } from './elastic/elastic.controller';
import { ConfigModule } from '@nestjs/config';

@Module({
  imports: [ConfigModule.forRoot({isGlobal: true}),ElasticModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
