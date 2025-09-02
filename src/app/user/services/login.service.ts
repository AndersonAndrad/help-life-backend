import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtAuthenticatorService } from 'src/core/authenticator/jwt-authenticator/jwt-authenticator.service';
import { LoginResponseDto } from '../dto/login-response.dto';
import { LoginDto } from '../dto/login.dto';

@Injectable()
export class LoginService {
  constructor(private readonly jwtAuthenticatorService: JwtAuthenticatorService) {}

  /**
   * Authenticates a user and generates a JWT token
   * @param loginDto - Login credentials (email only)
   * @returns JWT token response
   */
  login(loginDto: LoginDto): LoginResponseDto {
    // For this example, we'll use a simple email validation
    if (!this.validateEmail(loginDto.email)) {
      throw new UnauthorizedException('Invalid email address');
    }

    // Generate JWT token
    const tokenResponse = this.jwtAuthenticatorService.generateToken(loginDto.email);

    return {
      accessToken: tokenResponse.accessToken,
      expiresIn: tokenResponse.expiresIn,
      email: loginDto.email,
      message: 'Login successful',
    };
  }

  /**
   * Validates email address
   * @param email - User email
   * @returns True if email is valid
   */
  private validateEmail(email: string): boolean {
    // Simple email validation - in real app, you might want more robust validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  }

  /**
   * Validates a JWT token
   * @param token - JWT token to validate
   * @returns True if token is valid
   */
  validateToken(token: string): boolean {
    return this.jwtAuthenticatorService.isTokenValid(token);
  }

  /**
   * Extracts email from JWT token
   * @param token - JWT token
   * @returns Email from token
   */
  getEmailFromToken(token: string): string {
    return this.jwtAuthenticatorService.extractEmailFromToken(token);
  }
}
