import { Injectable } from '@nestjs/common';
import * as crypto from 'crypto';

export interface OtpData {
  code: string;
  email: string;
  expiresAt: Date;
  attempts: number;
  maxAttempts: number;
}

@Injectable()
export class OtpService {
  private readonly otpStore = new Map<string, OtpData>();
  private readonly OTP_LENGTH = 6;
  private readonly OTP_EXPIRY_MINUTES = 1;
  private readonly MAX_ATTEMPTS = 3;

  /**
   * Generates a new OTP code for the given email
   * @param email - The email address to generate OTP for
   * @returns The generated OTP code
   */
  generate(email: string): string {
    const otp = crypto.randomInt(100000, 999999).toString();

    // Calculate expiration time (1 minute from now)
    const expiresAt = new Date();
    expiresAt.setMinutes(expiresAt.getMinutes() + this.OTP_EXPIRY_MINUTES);

    this.saveLocal(email, otp, expiresAt);

    return otp;
  }

  /**
   * Validates the provided OTP code for the given email
   * @param email - The email address
   * @param code - The OTP code to validate
   * @returns True if valid, false otherwise
   */
  validate(email: string, code: string): boolean {
    const otpData = this.otpStore.get(email);

    if (!otpData) return false;

    if (new Date() > otpData.expiresAt) {
      this.otpStore.delete(email);
      return false;
    }

    // Check if max attempts exceeded
    if (otpData.attempts >= otpData.maxAttempts) {
      this.otpStore.delete(email);
      return false;
    }

    otpData.attempts++;

    if (otpData.code === code) {
      // Remove OTP from store after successful validation
      this.otpStore.delete(email);
      return true;
    }

    // If max attempts reached, remove OTP
    if (otpData.attempts >= otpData.maxAttempts) {
      this.otpStore.delete(email);
    }

    return false;
  }

  /**
   * Saves OTP data locally in memory
   * @param email - The email address
   * @param code - The OTP code
   * @param expiresAt - The expiration time
   */
  private saveLocal(email: string, code: string, expiresAt: Date): void {
    const otpData: OtpData = {
      code,
      email,
      expiresAt,
      attempts: 0,
      maxAttempts: this.MAX_ATTEMPTS,
    };

    this.otpStore.set(email, otpData);

    // Schedule cleanup after expiration
    setTimeout(
      () => {
        this.otpStore.delete(email);
      },
      this.OTP_EXPIRY_MINUTES * 60 * 1000,
    );
  }

  /**
   * Gets OTP data for the given email (for testing/debugging purposes)
   * @param email - The email address
   * @returns OTP data or undefined if not found
   */
  getOtpData(email: string): OtpData | undefined {
    return this.otpStore.get(email);
  }

  /**
   * Removes OTP data for the given email
   * @param email - The email address
   */
  removeOtp(email: string): void {
    this.otpStore.delete(email);
  }

  /**
   * Gets the number of stored OTPs (for monitoring purposes)
   * @returns Number of active OTPs
   */
  getActiveOtpCount(): number {
    return this.otpStore.size;
  }

  /**
   * Cleans up expired OTPs
   */
  cleanupExpiredOtps(): void {
    const now = new Date();
    for (const [email, otpData] of this.otpStore.entries()) {
      if (now > otpData.expiresAt) {
        this.otpStore.delete(email);
      }
    }
  }
}
