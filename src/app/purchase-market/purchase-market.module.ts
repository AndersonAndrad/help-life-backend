import { Module } from '@nestjs/common';
import { MongoosePurchaseMarketRepository, PurchaseMarketRepositorySymbol } from 'src/infra/database/mongo/repository/mongoose-purchase-market.repository';
import { CrudPurchaseMarketController } from './controllers/crud-purchase-market.controllers';
import { CrudPurchaseMarketService } from './services/crud-purchase-market.service';

@Module({
  imports: [],
  controllers: [CrudPurchaseMarketController],
  providers: [{ provide: PurchaseMarketRepositorySymbol, useClass: MongoosePurchaseMarketRepository }, CrudPurchaseMarketService],
})
export class PurchaseMarketModule {}
