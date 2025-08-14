import { Body, Controller, Delete, Get, Param, Post, Put, Query } from '@nestjs/common';
import { Permittion, PurchaseMakert } from 'src/core/types/purchase-market.interface';
import { CreatePurchaseMarketDto } from '../dto/create-purchase-market.dto';
import { CrudPurchaseMarketService } from '../services/crud-purchase-market.service';
import { PurchaseMarketAccessService } from '../services/purchase-market-access.service';

@Controller('purchase-market')
export class CrudPurchaseMarketController {
  constructor(
    private readonly crudPurchaseMarketService: CrudPurchaseMarketService,
    private readonly purchaseMarketAccessService: PurchaseMarketAccessService,
  ) {}

  @Post()
  create(@Body() purchaseMarket: CreatePurchaseMarketDto): Promise<PurchaseMakert> {
    return this.crudPurchaseMarketService.create(purchaseMarket);
  }

  @Get(':purchaseMarketId')
  findOne(@Param('purchaseMarketId') purchaseMarketId: string): Promise<PurchaseMakert> {
    return this.crudPurchaseMarketService.findOne(purchaseMarketId);
  }

  @Delete(':purchaseMarketId')
  delete(@Param('purchaseMarketId') purchaseMarketId: string): Promise<void> {
    return this.crudPurchaseMarketService.delete(purchaseMarketId);
  }

  @Post(':purchaseMarketId/share')
  shareAccess(
    @Param('purchaseMarketId') purchaseMarketId: string,
    @Body()
    shareData: {
      userEmail: string;
      permissions: Permittion[];
      creator?: boolean;
    },
    @Query('requesterEmail') requesterEmail: string,
  ): Promise<PurchaseMakert> {
    return this.purchaseMarketAccessService.shareAccess(purchaseMarketId, shareData.userEmail, shareData.permissions, shareData.creator || false, requesterEmail);
  }

  @Delete(':purchaseMarketId/revoke/:userEmail')
  revokeAccess(
    @Param('purchaseMarketId') purchaseMarketId: string,
    @Param('userEmail') userEmail: string,
    @Query('requesterEmail') requesterEmail: string,
  ): Promise<PurchaseMakert> {
    return this.purchaseMarketAccessService.revokeAccess(purchaseMarketId, userEmail, requesterEmail);
  }

  @Put(':purchaseMarketId/permissions/:userEmail')
  updateUserPermissions(
    @Param('purchaseMarketId') purchaseMarketId: string,
    @Param('userEmail') userEmail: string,
    @Body() permissionsData: { permissions: Permittion[] },
    @Query('requesterEmail') requesterEmail: string,
  ): Promise<PurchaseMakert> {
    return this.purchaseMarketAccessService.updateUserPermissions(purchaseMarketId, userEmail, permissionsData.permissions, requesterEmail);
  }

  @Get(':purchaseMarketId/access/:userEmail')
  getUserAccess(@Param('purchaseMarketId') purchaseMarketId: string, @Param('userEmail') userEmail: string) {
    return this.purchaseMarketAccessService.getUserAccess(purchaseMarketId, userEmail);
  }

  @Get(':purchaseMarketId/users')
  listUsersWithAccess(@Param('purchaseMarketId') purchaseMarketId: string, @Query('requesterEmail') requesterEmail: string) {
    return this.purchaseMarketAccessService.listUsersWithAccess(purchaseMarketId, requesterEmail);
  }
}
