import { Injectable, Inject } from '@nestjs/common';
import { CACHE_MANAGER } from '@nestjs/cache-manager';
import { Cache } from 'cache-manager';
import { generateOtp } from '@common/utils';

const OTP_TTL_SECONDS = 600; // 10 minutes
const RESEND_COOLDOWN_SECONDS = 60; // 1 minute cooldown between resends

@Injectable()
export class OtpService {
  constructor(@Inject(CACHE_MANAGER) private readonly cache: Cache) {}

  private otpKey(email: string, type: string) {
    return `otp:${type}:${email}`;
  }

  private cooldownKey(email: string, type: string) {
    return `otp:cooldown:${type}:${email}`;
  }

  async generate(email: string, type: 'verify' | 'reset'): Promise<string> {
    const otp = generateOtp(6);
    await this.cache.set(this.otpKey(email, type), otp, OTP_TTL_SECONDS * 1000);
    return otp;
  }

  async verify(email: string, type: 'verify' | 'reset', otp: string): Promise<boolean> {
    const stored = await this.cache.get<string>(this.otpKey(email, type));
    if (!stored || stored !== otp) return false;
    await this.cache.del(this.otpKey(email, type));
    return true;
  }

  async canResend(email: string, type: 'verify' | 'reset'): Promise<boolean> {
    const cooldown = await this.cache.get(this.cooldownKey(email, type));
    return !cooldown;
  }

  async setCooldown(email: string, type: 'verify' | 'reset'): Promise<void> {
    await this.cache.set(this.cooldownKey(email, type), '1', RESEND_COOLDOWN_SECONDS * 1000);
  }

  async getRemainingTtl(email: string, type: 'verify' | 'reset'): Promise<number> {
    const stored = await this.cache.get<string>(this.otpKey(email, type));
    return stored ? OTP_TTL_SECONDS : 0;
  }
}
