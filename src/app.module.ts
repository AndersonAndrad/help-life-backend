import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { MongoModule } from './infra/database/mongo/mongo.module';

@Module({
  imports: [ConfigModule.forRoot(), MongoModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
