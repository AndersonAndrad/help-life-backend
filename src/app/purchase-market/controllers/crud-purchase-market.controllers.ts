import { Body, Controller, Post } from '@nestjs/common';
import { PurchaseMakert } from 'src/core/types/purchase-market.interface';
import { CreatePurchaseMarketDto } from '../dto/create-purchase-market.dto';
import { CrudPurchaseMarketService } from '../services/crud-purchase-market.service';

@Controller('purchase-market')
export class CrudPurchaseMarketController {
  constructor(private readonly crudPurchaseMarketService: CrudPurchaseMarketService) {}

  @Post()
  create(@Body() purchaseMarket: CreatePurchaseMarketDto): Promise<PurchaseMakert> {
    return this.crudPurchaseMarketService.create(purchaseMarket);
  }
}
