import { ForbiddenException, Inject, Injectable, NotFoundException } from '@nestjs/common';
import { Permittion, PurchaseMakert, PurchaseMarketEmail } from 'src/core/types/purchase-market.interface';
import { MongoosePurchaseMarketRepository, PurchaseMarketRepositorySymbol } from 'src/infra/database/mongo/repository/mongoose-purchase-market.repository';

@Injectable()
export class PurchaseMarketAccessService {
  constructor(
    @Inject(PurchaseMarketRepositorySymbol)
    private readonly purchaseMarketRepository: MongoosePurchaseMarketRepository,
  ) {}

  /**
   * Share purchase market access with a new user
   */
  async shareAccess(purchaseMarketId: string, userEmail: string, permissions: Permittion[], creator: boolean = false, requesterEmail: string): Promise<PurchaseMakert> {
    const purchaseMarket = await this.purchaseMarketRepository.findOne(purchaseMarketId);

    if (!purchaseMarket) {
      throw new NotFoundException(`Purchase market with ID ${purchaseMarketId} not found`);
    }

    const requesterAccess = this.getUserAccessByMarketAndEmail(purchaseMarket, requesterEmail);
    if (!requesterAccess || !requesterAccess.permittions.includes(Permittion.UPDATE)) {
      throw new ForbiddenException('You do not have permission to share this purchase market');
    }

    // Check if user already has access
    const existingAccess = purchaseMarket.emails.find((email) => email.email === userEmail);

    if (existingAccess) {
      throw new ForbiddenException(`User ${userEmail} already has access to this purchase market`);
    }

    const newAccess: PurchaseMarketEmail = {
      email: userEmail,
      permittions: permissions,
      creator,
    };

    purchaseMarket.emails.push(newAccess);

    return this.purchaseMarketRepository.updateOne(purchaseMarketId, purchaseMarket);
  }

  /**
   * Revoke access for a specific user
   */
  async revokeAccess(purchaseMarketId: string, userEmail: string, requesterEmail: string): Promise<PurchaseMakert> {
    const purchaseMarket = await this.purchaseMarketRepository.findOne(purchaseMarketId);

    if (!purchaseMarket) {
      throw new NotFoundException(`Purchase market with ID ${purchaseMarketId} not found`);
    }

    const requesterAccess = this.getUserAccessByMarketAndEmail(purchaseMarket, requesterEmail);
    if (!requesterAccess || !requesterAccess.permittions.includes(Permittion.UPDATE)) {
      throw new ForbiddenException('You do not have permission to revoke access to this purchase market');
    }

    if (requesterEmail === userEmail) {
      throw new ForbiddenException('You cannot revoke your own access');
    }

    const userToRevoke = purchaseMarket.emails.find((email) => email.email === userEmail);
    if (userToRevoke?.creator) {
      throw new ForbiddenException('Cannot revoke access from the creator');
    }

    const updatedEmails = purchaseMarket.emails.filter((email) => email.email !== userEmail);

    if (updatedEmails.length === 0) {
      throw new ForbiddenException('Cannot remove all users from the purchase market');
    }

    purchaseMarket.emails = updatedEmails;

    return this.purchaseMarketRepository.updateOne(purchaseMarketId, purchaseMarket);
  }

  /**
   * Update user permissions
   */
  async updateUserPermissions(purchaseMarketId: string, userEmail: string, newPermissions: Permittion[], requesterEmail: string): Promise<PurchaseMakert> {
    const purchaseMarket = await this.purchaseMarketRepository.findOne(purchaseMarketId);

    if (!purchaseMarket) {
      throw new NotFoundException(`Purchase market with ID ${purchaseMarketId} not found`);
    }

    const requesterAccess = this.getUserAccessByMarketAndEmail(purchaseMarket, requesterEmail);
    if (!requesterAccess || !requesterAccess.permittions.includes(Permittion.UPDATE)) {
      throw new ForbiddenException('You do not have permission to update permissions for this purchase market');
    }

    const userToUpdate = purchaseMarket.emails.find((email) => email.email === userEmail);
    if (userToUpdate?.creator) {
      throw new ForbiddenException('Cannot modify permissions of the creator');
    }

    const userIndex = purchaseMarket.emails.findIndex((email) => email.email === userEmail);
    if (userIndex === -1) {
      throw new NotFoundException(`User ${userEmail} does not have access to this purchase market`);
    }

    purchaseMarket.emails[userIndex].permittions = newPermissions;

    return this.purchaseMarketRepository.updateOne(purchaseMarketId, purchaseMarket);
  }

  /**
   * Get user access information for a purchase market
   */
  async getUserAccess(purchaseMarketId: string, userEmail: string): Promise<PurchaseMarketEmail | null> {
    const purchaseMarket = await this.purchaseMarketRepository.findOne(purchaseMarketId);

    if (!purchaseMarket) {
      throw new NotFoundException(`Purchase market with ID ${purchaseMarketId} not found`);
    }

    return this.getUserAccessFromMarket(purchaseMarket, userEmail);
  }

  /**
   * List all users with access to a purchase market
   */
  async listUsersWithAccess(purchaseMarketId: string, requesterEmail: string): Promise<PurchaseMarketEmail[]> {
    const purchaseMarket = await this.purchaseMarketRepository.findOne(purchaseMarketId);

    if (!purchaseMarket) {
      throw new NotFoundException(`Purchase market with ID ${purchaseMarketId} not found`);
    }

    // Check if requester has permission to view users
    const requesterAccess = this.getUserAccessFromMarket(purchaseMarket, requesterEmail);
    if (!requesterAccess || !requesterAccess.permittions.includes(Permittion.VIEW)) {
      throw new ForbiddenException('You do not have permission to view users for this purchase market');
    }

    return purchaseMarket.emails;
  }

  /**
   * Helper method to get user access from a purchase market object
   */
  private getUserAccessFromMarket(purchaseMarket: PurchaseMakert, userEmail: string): PurchaseMarketEmail | null {
    return purchaseMarket.emails.find((email) => email.email === userEmail) || null;
  }

  /**
   * Helper method to get user access (alias for getUserAccessFromMarket)
   */
  private getUserAccessByMarketAndEmail(purchaseMarket: PurchaseMakert, userEmail: string): PurchaseMarketEmail | null {
    return this.getUserAccessFromMarket(purchaseMarket, userEmail);
  }
}
