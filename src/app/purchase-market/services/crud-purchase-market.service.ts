import { Inject, Injectable } from '@nestjs/common';
import { PurchaseMakert, SearchPurchaseMarketFilter } from 'src/core/types/purchase-market.interface';
import { ResponsePagination } from 'src/core/types/request-response.interface';
import { MongoosePurchaseMarketRepository, PurchaseMarketRepositorySymbol } from 'src/infra/database/mongo/repository/mongoose-purchase-market.repository';

@Injectable()
export class CrudPurchaseMarketService {
  constructor(@Inject(PurchaseMarketRepositorySymbol) private readonly purchaseMarketRepository: MongoosePurchaseMarketRepository) {}

  create(purchaseMarket: Omit<PurchaseMakert, '_id'>): Promise<PurchaseMakert> {
    return this.purchaseMarketRepository.create(purchaseMarket);
  }

  find(filter: SearchPurchaseMarketFilter): Promise<ResponsePagination<PurchaseMakert>> {
    return this.purchaseMarketRepository.find(filter);
  }

  findOne(id: string): Promise<PurchaseMakert> {
    return this.purchaseMarketRepository.findOne(id);
  }

  delete(id: string): Promise<void> {
    return this.purchaseMarketRepository.delete(id);
  }
}
