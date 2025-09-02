import { UnauthorizedException } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { Test, TestingModule } from '@nestjs/testing';
import { JwtAuthenticatorService } from './jwt-authenticator.service';

describe('JwtAuthenticatorService', () => {
  let service: JwtAuthenticatorService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [
        JwtModule.register({
          secret: 'test-secret-key',
          signOptions: { expiresIn: '1h' },
        }),
      ],
      providers: [JwtAuthenticatorService],
    }).compile();

    service = module.get<JwtAuthenticatorService>(JwtAuthenticatorService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('generateToken', () => {
    it('should generate a JWT token for the given email', () => {
      const email = 'test@example.com';
      const result = service.generateToken(email);

      expect(result).toHaveProperty('accessToken');
      expect(result).toHaveProperty('expiresIn');
      expect(result.expiresIn).toBe(3600);
      expect(typeof result.accessToken).toBe('string');
      expect(result.accessToken.length).toBeGreaterThan(0);
    });

    it('should generate different tokens for different emails', () => {
      const email1 = 'user1@example.com';
      const email2 = 'user2@example.com';

      const token1 = service.generateToken(email1);
      const token2 = service.generateToken(email2);

      expect(token1.accessToken).not.toBe(token2.accessToken);
    });
  });

  describe('verifyToken', () => {
    it('should verify a valid token', () => {
      const email = 'test@example.com';
      const tokenResponse = service.generateToken(email);
      const payload = service.verifyToken(tokenResponse.accessToken);

      expect(payload.email).toBe(email);
      expect(payload).toHaveProperty('iat');
      expect(payload).toHaveProperty('exp');
    });

    it('should throw UnauthorizedException for invalid token', () => {
      const invalidToken = 'invalid.token.here';

      expect(() => service.verifyToken(invalidToken)).toThrow(UnauthorizedException);
    });

    it('should throw UnauthorizedException for empty token', () => {
      expect(() => service.verifyToken('')).toThrow(UnauthorizedException);
    });
  });

  describe('decodeToken', () => {
    it('should decode a token without verification', () => {
      const email = 'test@example.com';
      const tokenResponse = service.generateToken(email);
      const payload = service.decodeToken(tokenResponse.accessToken);

      expect(payload.email).toBe(email);
    });
  });

  describe('extractEmailFromToken', () => {
    it('should extract email from a valid token', () => {
      const email = 'test@example.com';
      const tokenResponse = service.generateToken(email);
      const extractedEmail = service.extractEmailFromToken(tokenResponse.accessToken);

      expect(extractedEmail).toBe(email);
    });

    it('should throw UnauthorizedException for invalid token', () => {
      const invalidToken = 'invalid.token.here';

      expect(() => service.extractEmailFromToken(invalidToken)).toThrow(UnauthorizedException);
    });
  });

  describe('isTokenValid', () => {
    it('should return true for valid token', () => {
      const email = 'test@example.com';
      const tokenResponse = service.generateToken(email);
      const isValid = service.isTokenValid(tokenResponse.accessToken);

      expect(isValid).toBe(true);
    });

    it('should return false for invalid token', () => {
      const invalidToken = 'invalid.token.here';
      const isValid = service.isTokenValid(invalidToken);

      expect(isValid).toBe(false);
    });

    it('should return false for empty token', () => {
      const isValid = service.isTokenValid('');

      expect(isValid).toBe(false);
    });
  });
});
