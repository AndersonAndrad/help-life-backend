import { Injectable, NotFoundException } from '@nestjs/common';
import { PurchaseMarketRepository } from 'src/core/repository/purchase-market.interface';
import { PurchaseMakert, SearchPurchaseMarketFilter } from 'src/core/types/purchase-market.interface';
import { ResponsePagination } from 'src/core/types/request-response.interface';
import { formatMongoDocuments } from 'src/core/utils/mongoose.utils';
import { PurchaseMarketModel } from '../schema/purchase-market.schema';

export const PurchaseMarketRepositorySymbol = Symbol('PurchaseMarketRepositoryDb');

@Injectable()
export class MongoosePurchaseMarketRepository implements PurchaseMarketRepository {
  async create(entity: Omit<PurchaseMakert, '_id'>): Promise<PurchaseMakert> {
    const purchaseMarket = await PurchaseMarketModel.create(entity);

    return formatMongoDocuments(purchaseMarket);
  }

  async find(filter: SearchPurchaseMarketFilter): Promise<ResponsePagination<PurchaseMakert>> {
    const { page = 1, limit = 10, ...rest } = filter;
    const skip = (page - 1) * limit;

    const query = {};

    if (rest?.email) {
      query['emails.email'] = rest.email;
    }

    const [purchaseMarkets, total] = await Promise.all([PurchaseMarketModel.find(query).skip(skip).limit(limit).exec(), PurchaseMarketModel.countDocuments(query)]);

    return {
      data: purchaseMarkets.map((purchaseMarket) => formatMongoDocuments(purchaseMarket)),
      total,
      page,
      limit,
    };
  }

  async findOne(id: string): Promise<PurchaseMakert> {
    const purchaseMarket = await PurchaseMarketModel.findById(id).exec();

    if (!purchaseMarket) {
      throw new NotFoundException(`Purchase market with ID ${id} not found`);
    }

    return formatMongoDocuments(purchaseMarket);
  }

  async updateOne(id: string, entity: PurchaseMakert): Promise<PurchaseMakert> {
    const updatedPurchaseMarket = await PurchaseMarketModel.findByIdAndUpdate(id, entity, { new: true, runValidators: true }).exec();

    if (!updatedPurchaseMarket) {
      throw new NotFoundException(`Purchase market with ID ${id} not found`);
    }

    return formatMongoDocuments(updatedPurchaseMarket);
  }

  async delete(id: string): Promise<void> {
    const result = await PurchaseMarketModel.findByIdAndDelete(id).exec();

    if (!result) {
      throw new NotFoundException(`Purchase market with ID ${id} not found`);
    }
  }
}
