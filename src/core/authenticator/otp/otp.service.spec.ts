import { Test, TestingModule } from '@nestjs/testing';
import { OtpService } from './otp.service';

describe('OtpService', () => {
  let service: OtpService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [OtpService],
    }).compile();

    service = module.get<OtpService>(OtpService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('generate', () => {
    it('should generate a 6-digit OTP', () => {
      const email = 'test@example.com';
      const otp = service.generate(email);

      expect(otp).toHaveLength(6);
      expect(otp).toMatch(/^\d{6}$/);
    });

    it('should save OTP data locally', () => {
      const email = 'test@example.com';
      service.generate(email);

      const otpData = service.getOtpData(email);
      expect(otpData).toBeDefined();
      expect(otpData?.email).toBe(email);
      expect(otpData?.code).toHaveLength(6);
      expect(otpData?.attempts).toBe(0);
      expect(otpData?.maxAttempts).toBe(3);
    });
  });

  describe('validate', () => {
    it('should validate correct OTP', () => {
      const email = 'test@example.com';
      const otp = service.generate(email);

      const isValid = service.validate(email, otp);
      expect(isValid).toBe(true);
    });

    it('should reject incorrect OTP', () => {
      const email = 'test@example.com';
      service.generate(email);

      const isValid = service.validate(email, '123456');
      expect(isValid).toBe(false);
    });

    it('should reject OTP after max attempts', () => {
      const email = 'test@example.com';
      const otp = service.generate(email);

      // Try wrong codes 3 times
      service.validate(email, '111111');
      service.validate(email, '222222');
      service.validate(email, '333333');

      // Now try the correct code
      const isValid = service.validate(email, otp);
      expect(isValid).toBe(false);
    });

    it('should reject OTP for non-existent email', () => {
      const isValid = service.validate('nonexistent@example.com', '123456');
      expect(isValid).toBe(false);
    });
  });

  describe('expiration', () => {
    it('should reject expired OTP', async () => {
      const email = 'test@example.com';
      const otp = service.generate(email);

      // Wait for expiration (1 minute + buffer)
      await new Promise((resolve) => setTimeout(resolve, 65000));

      const isValid = service.validate(email, otp);
      expect(isValid).toBe(false);
    });
  });

  describe('cleanup', () => {
    it('should clean up expired OTPs', () => {
      const email = 'test@example.com';
      service.generate(email);

      service.cleanupExpiredOtps();
      const otpData = service.getOtpData(email);
      expect(otpData).toBeDefined(); // Should still exist as it's not expired yet
    });

    it('should remove OTP data', () => {
      const email = 'test@example.com';
      service.generate(email);

      service.removeOtp(email);
      const otpData = service.getOtpData(email);
      expect(otpData).toBeUndefined();
    });
  });
});
