import { Injectable, NotFoundException } from '@nestjs/common';
import { PurchaseMarketRepository } from 'src/core/repository/purchase-market.interface';
import { PurchaseMakert } from 'src/core/types/purchase-market.interface';
import { formatMongoDocuments } from 'src/core/utils/mongoose.utils';
import { PurchaseMarketModel } from '../schema/purchase-market.schema';

export const PurchaseMarketRepositorySymbol = Symbol('PurchaseMarketRepositoryDb');

@Injectable()
export class MongoosePurchaseMarketRepository implements PurchaseMarketRepository {
  async create(entity: Omit<PurchaseMakert, '_id'>): Promise<PurchaseMakert> {
    const purchaseMarket = await PurchaseMarketModel.create(entity);

    return formatMongoDocuments(purchaseMarket);
  }

  find(filter: any): Promise<PurchaseMakert[]> {
    throw new Error('Method not implemented.');
  }

  async findOne(id: string): Promise<PurchaseMakert> {
    const purchaseMarket = await PurchaseMarketModel.findById(id).exec();

    if (!purchaseMarket) {
      throw new NotFoundException(`Purchase market with ID ${id} not found`);
    }

    return formatMongoDocuments(purchaseMarket);
  }

  updateOne(id: string, entity: PurchaseMakert): Promise<PurchaseMakert> {
    throw new Error('Method not implemented.');
  }

  async delete(id: string): Promise<void> {
    const result = await PurchaseMarketModel.findByIdAndDelete(id).exec();

    if (!result) {
      throw new NotFoundException(`Purchase market with ID ${id} not found`);
    }
  }
}
