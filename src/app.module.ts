import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { PurchaseMarketModule } from './app/purchase-market/purchase-market.module';
import { UserModule } from './app/user/user.module';
import { JwtAuthenticatorModule } from './core/authenticator/jwt-authenticator/jwt-authenticator.module';
import { MongoModule } from './infra/database/mongo/mongo.module';

@Module({
  imports: [ConfigModule.forRoot(), MongoModule, PurchaseMarketModule, UserModule, JwtAuthenticatorModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
