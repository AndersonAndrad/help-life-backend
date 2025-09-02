import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';

export interface JwtPayload {
  email: string;
  iat?: number;
  exp?: number;
}

export interface JwtTokenResponse {
  accessToken: string;
  expiresIn: number;
}

@Injectable()
export class JwtAuthenticatorService {
  constructor(private readonly jwtService: JwtService) {}

  /**
   * Generates a JWT token for the given email
   * @param email - The email address to include in the JWT payload
   * @returns JWT token response with access token and expiration
   */
  generateToken(email: string): JwtTokenResponse {
    const payload: JwtPayload = {
      email,
    };

    const accessToken = this.jwtService.sign(payload);
    const expiresIn = this.getTokenExpirationTime();

    return {
      accessToken,
      expiresIn,
    };
  }

  /**
   * Verifies and decodes a JWT token
   * @param token - The JWT token to verify
   * @returns The decoded JWT payload
   */
  verifyToken(token: string): JwtPayload {
    try {
      return this.jwtService.verify<JwtPayload>(token);
    } catch {
      throw new UnauthorizedException('Invalid or expired token');
    }
  }

  /**
   * Decodes a JWT token without verification (for debugging purposes)
   * @param token - The JWT token to decode
   * @returns The decoded JWT payload
   */
  decodeToken(token: string): JwtPayload {
    return this.jwtService.decode<JwtPayload>(token);
  }

  /**
   * Extracts email from JWT token
   * @param token - The JWT token
   * @returns The email from the token payload
   */
  extractEmailFromToken(token: string): string {
    const payload = this.verifyToken(token);
    return payload.email;
  }

  /**
   * Checks if a JWT token is valid
   * @param token - The JWT token to check
   * @returns True if valid, false otherwise
   */
  isTokenValid(token: string): boolean {
    try {
      this.jwtService.verify(token);
      return true;
    } catch {
      return false;
    }
  }

  /**
   * Gets the token expiration time in seconds
   * @returns Expiration time in seconds
   */
  private getTokenExpirationTime(): number {
    // Default to 1 hour (3600 seconds)
    // This can be configured via environment variables
    return 3600;
  }
}
