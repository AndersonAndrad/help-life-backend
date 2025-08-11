import { CrudRepository } from '../types/crud.interface';
import { PurchaseMakert } from '../types/purchase-market.interface';

export interface PurchaseMarketRepository extends CrudRepository<PurchaseMakert> {}
