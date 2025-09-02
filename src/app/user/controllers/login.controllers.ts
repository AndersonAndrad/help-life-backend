import { Body, Controller, Get, Headers, Post, UseGuards } from '@nestjs/common';
import { CurrentUser } from 'src/core/authenticator/jwt-authenticator/current-user.decorator';
import { JwtAuthGuard } from 'src/core/authenticator/jwt-authenticator/jwt-auth.guard';
import { JwtPayload } from 'src/core/authenticator/jwt-authenticator/jwt-authenticator.service';
import { LoginResponseDto } from '../dto/login-response.dto';
import { LoginDto } from '../dto/login.dto';
import { LoginService } from '../services/login.service';

@Controller('auth')
export class LoginController {
  constructor(private readonly loginService: LoginService) {}

  @Post('login')
  login(@Body() loginDto: LoginDto): LoginResponseDto {
    return this.loginService.login(loginDto);
  }

  @Post('verify')
  verifyToken(@Body() body: { token: string }): { valid: boolean; email?: string } {
    try {
      const isValid = this.loginService.validateToken(body.token);
      if (isValid) {
        const email = this.loginService.getEmailFromToken(body.token);
        return {
          valid: true,
          email,
        };
      }
      return { valid: false };
    } catch {
      return { valid: false };
    }
  }

  @Get('profile')
  @UseGuards(JwtAuthGuard)
  getProfile(@CurrentUser() user: JwtPayload) {
    return {
      email: user.email,
      message: 'Profile accessed successfully',
    };
  }

  @Get('validate')
  @UseGuards(JwtAuthGuard)
  validateAuth(@Headers('authorization') authHeader: string) {
    const token = authHeader?.replace('Bearer ', '');
    return {
      valid: true,
      message: 'Token is valid',
      token: token ? '***' + token.slice(-4) : undefined, // Show only last 4 chars for security
    };
  }
}
