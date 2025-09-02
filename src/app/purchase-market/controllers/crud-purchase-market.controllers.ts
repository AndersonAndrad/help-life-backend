import { Body, Controller, Delete, Get, Param, Post, Put, Query, UseGuards } from '@nestjs/common';
import { CurrentUser } from 'src/core/authenticator/jwt-authenticator/current-user.decorator';
import { JwtAuthGuard } from 'src/core/authenticator/jwt-authenticator/jwt-auth.guard';
import { JwtPayload } from 'src/core/authenticator/jwt-authenticator/jwt-authenticator.service';
import { Permittion, PurchaseMakert } from 'src/core/types/purchase-market.interface';
import { ResponsePagination } from 'src/core/types/request-response.interface';
import { CreatePurchaseMarketDto } from '../dto/create-purchase-market.dto';
import { SearchPurchaseMarketDto } from '../dto/search-purchase-market.dto';
import { CrudPurchaseMarketService } from '../services/crud-purchase-market.service';
import { PurchaseMarketAccessService } from '../services/purchase-market-access.service';

@Controller('purchase-market')
@UseGuards(JwtAuthGuard)
export class CrudPurchaseMarketController {
  constructor(
    private readonly crudPurchaseMarketService: CrudPurchaseMarketService,
    private readonly purchaseMarketAccessService: PurchaseMarketAccessService,
  ) {}

  @Post()
  create(@Body() purchaseMarket: CreatePurchaseMarketDto, @CurrentUser() user: JwtPayload): Promise<PurchaseMakert> {
    // Add the creator's email to the purchase market
    const purchaseMarketWithCreator = {
      ...purchaseMarket,
      emails: [
        {
          email: user.email,
          permittions: [Permittion.VIEW, Permittion.UPDATE, Permittion.DELETE],
          creator: true,
        },
        ...(purchaseMarket.emails || []),
      ],
    };
    return this.crudPurchaseMarketService.create(purchaseMarketWithCreator);
  }

  @Get()
  find(@Query() searchFilter: SearchPurchaseMarketDto, @CurrentUser() user: JwtPayload): Promise<ResponsePagination<PurchaseMakert>> {
    // Filter by user's email to show only accessible purchase markets
    const filterWithUser = {
      ...searchFilter,
      email: user.email,
    };
    return this.crudPurchaseMarketService.find(filterWithUser);
  }

  @Get(':purchaseMarketId')
  findOne(@Param('purchaseMarketId') purchaseMarketId: string, @CurrentUser() user: JwtPayload): Promise<PurchaseMakert> {
    return this.crudPurchaseMarketService.findOne(purchaseMarketId);
  }

  @Delete(':purchaseMarketId')
  delete(@Param('purchaseMarketId') purchaseMarketId: string, @CurrentUser() user: JwtPayload): Promise<void> {
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
    @CurrentUser() user: JwtPayload,
  ): Promise<PurchaseMakert> {
    return this.purchaseMarketAccessService.shareAccess(purchaseMarketId, shareData.userEmail, shareData.permissions, shareData.creator || false, user.email);
  }

  @Delete(':purchaseMarketId/revoke/:userEmail')
  revokeAccess(@Param('purchaseMarketId') purchaseMarketId: string, @Param('userEmail') userEmail: string, @CurrentUser() user: JwtPayload): Promise<PurchaseMakert> {
    return this.purchaseMarketAccessService.revokeAccess(purchaseMarketId, userEmail, user.email);
  }

  @Put(':purchaseMarketId/permissions/:userEmail')
  updateUserPermissions(
    @Param('purchaseMarketId') purchaseMarketId: string,
    @Param('userEmail') userEmail: string,
    @Body() permissionsData: { permissions: Permittion[] },
    @CurrentUser() user: JwtPayload,
  ): Promise<PurchaseMakert> {
    return this.purchaseMarketAccessService.updateUserPermissions(purchaseMarketId, userEmail, permissionsData.permissions, user.email);
  }

  @Get(':purchaseMarketId/access/:userEmail')
  getUserAccess(@Param('purchaseMarketId') purchaseMarketId: string, @Param('userEmail') userEmail: string, @CurrentUser() user: JwtPayload) {
    return this.purchaseMarketAccessService.getUserAccess(purchaseMarketId, userEmail);
  }

  @Get(':purchaseMarketId/users')
  listUsersWithAccess(@Param('purchaseMarketId') purchaseMarketId: string, @CurrentUser() user: JwtPayload) {
    return this.purchaseMarketAccessService.listUsersWithAccess(purchaseMarketId, user.email);
  }
}
