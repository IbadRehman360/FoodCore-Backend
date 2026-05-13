import { randomInt } from 'crypto';

export function generateOtp(length = 6): string {
  const max = Math.pow(10, length);
  const min = Math.pow(10, length - 1);
  return randomInt(min, max).toString();
}

export function otpExpiresAt(minutes = 10): Date {
  return new Date(Date.now() + minutes * 60 * 1000);
}

export function isOtpExpired(expiresAt: Date): boolean {
  return new Date() > expiresAt;
}
