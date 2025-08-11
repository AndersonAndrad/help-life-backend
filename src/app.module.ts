import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { PurchaseMarketModule } from './app/purchase-market/purchase-market.module';
import { MongoModule } from './infra/database/mongo/mongo.module';

@Module({
  imports: [ConfigModule.forRoot(), MongoModule, PurchaseMarketModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
