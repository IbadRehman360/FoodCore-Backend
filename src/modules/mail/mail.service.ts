import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as nodemailer from 'nodemailer';

@Injectable()
export class MailService {
  private readonly logger = new Logger(MailService.name);
  private transporter: nodemailer.Transporter;

  constructor(private readonly config: ConfigService) {
    this.transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: this.config.get<string>('mail.gmailUser'),
        pass: this.config.get<string>('mail.gmailPassword'),
      },
    });
  }

  async sendOtpEmail(to: string, otp: string, expiryMinutes = 10): Promise<void> {
    try {
      await this.transporter.sendMail({
        from: `"${this.config.get('mail.fromName')}" <${this.config.get('mail.fromEmail')}>`,
        to,
        subject: 'Your FoodCure Verification Code',
        html: this.otpTemplate(otp, expiryMinutes),
      });
    } catch (err) {
      this.logger.error(`Failed to send OTP email to ${to}`, err);
    }
  }

  async sendPasswordResetEmail(to: string, otp: string): Promise<void> {
    try {
      await this.transporter.sendMail({
        from: `"${this.config.get('mail.fromName')}" <${this.config.get('mail.fromEmail')}>`,
        to,
        subject: 'Reset Your FoodCure Password',
        html: this.resetTemplate(otp),
      });
    } catch (err) {
      this.logger.error(`Failed to send reset email to ${to}`, err);
    }
  }

  private otpTemplate(otp: string, expiryMinutes: number): string {
    return `
      <div style="font-family:Arial,sans-serif;max-width:480px;margin:0 auto;padding:32px;background:#f9f9f9;border-radius:12px">
        <h2 style="color:#2d2d2d;text-align:center">FoodCure</h2>
        <p style="color:#555;text-align:center">We have sent a 6-digit verification code to your email.<br/>Please verify to confirm your identity.</p>
        <div style="background:#fff;border-radius:8px;padding:24px;text-align:center;margin:24px 0">
          <span style="font-size:36px;font-weight:bold;letter-spacing:12px;color:#4a90e2">${otp}</span>
        </div>
        <p style="color:#999;text-align:center;font-size:13px">This code expires in <strong>${expiryMinutes} minutes</strong>. Do not share it with anyone.</p>
      </div>
    `;
  }

  private resetTemplate(otp: string): string {
    return `
      <div style="font-family:Arial,sans-serif;max-width:480px;margin:0 auto;padding:32px;background:#f9f9f9;border-radius:12px">
        <h2 style="color:#2d2d2d;text-align:center">FoodCure</h2>
        <p style="color:#555;text-align:center">You requested a password reset. Use the code below:</p>
        <div style="background:#fff;border-radius:8px;padding:24px;text-align:center;margin:24px 0">
          <span style="font-size:36px;font-weight:bold;letter-spacing:12px;color:#e25c4a">${otp}</span>
        </div>
        <p style="color:#999;text-align:center;font-size:13px">This code expires in <strong>10 minutes</strong>. If you did not request this, please ignore this email.</p>
      </div>
    `;
  }
}
