import { Global, Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { JwtAuthGuard } from './jwt-auth.guard';
import { JwtAuthenticatorService } from './jwt-authenticator.service';

@Global()
@Module({
  imports: [
    JwtModule.register({
      secret: process.env.JWT_SECRET || 'your-secret-key',
      signOptions: {
        expiresIn: '1h',
      },
    }),
  ],
  providers: [JwtAuthenticatorService, JwtAuthGuard],
  exports: [JwtAuthenticatorService, JwtAuthGuard, JwtModule],
})
export class JwtAuthenticatorModule {}
