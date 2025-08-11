import { Inject, Injectable } from '@nestjs/common';
import { PurchaseMakert } from 'src/core/types/purchase-market.interface';
import { MongoosePurchaseMarketRepository, PurchaseMarketRepositorySymbol } from 'src/infra/database/mongo/repository/mongoose-purchase-market.repository';

@Injectable()
export class CrudPurchaseMarketService {
  constructor(@Inject(PurchaseMarketRepositorySymbol) private readonly purchaseMarketRepository: MongoosePurchaseMarketRepository) {}

  create(purchaseMarket: Omit<PurchaseMakert, '_id'>): Promise<PurchaseMakert> {
    return this.purchaseMarketRepository.create(purchaseMarket);
  }
}
