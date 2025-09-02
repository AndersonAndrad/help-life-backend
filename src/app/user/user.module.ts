import { Module } from '@nestjs/common';
import { JwtAuthenticatorModule } from 'src/core/authenticator/jwt-authenticator/jwt-authenticator.module';
import { LoginController } from './controllers/login.controllers';
import { LoginService } from './services/login.service';

@Module({
  imports: [JwtAuthenticatorModule],
  controllers: [LoginController],
  providers: [LoginService],
  exports: [LoginService],
})
export class UserModule {}
