import { CrudRepository } from '../types/crud.interface';
import { PurchaseMakert, SearchPurchaseMarketFilter } from '../types/purchase-market.interface';
import { ResponsePagination } from '../types/request-response.interface';

export interface PurchaseMarketRepository extends CrudRepository<PurchaseMakert, SearchPurchaseMarketFilter, ResponsePagination<PurchaseMakert>> {}
