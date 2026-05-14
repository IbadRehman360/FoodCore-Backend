import { Injectable, BadRequestException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import axios from 'axios';

@Injectable()
export class CaptchaService {
  private readonly enabled: boolean;
  private readonly secret: string;

  constructor(private readonly config: ConfigService) {
    this.enabled = config.get<string>('CAPTCHA_ENABLED') === 'true';
    this.secret = config.get<string>('RECAPTCHA_SECRET_KEY') ?? '';
  }

  async verify(token?: string): Promise<void> {
    if (!this.enabled) return;

    if (!token) {
      throw new BadRequestException('CAPTCHA token is required.');
    }

    try {
      const { data } = await axios.post<{ success: boolean; score?: number }>(
        'https://www.google.com/recaptcha/api/siteverify',
        null,
        { params: { secret: this.secret, response: token } },
      );

      if (!data.success) {
        throw new BadRequestException('CAPTCHA verification failed. Please try again.');
      }

      // reCAPTCHA v3 returns a score — anything below 0.5 is bot-like
      if (data.score !== undefined && data.score < 0.5) {
        throw new BadRequestException('Request blocked as suspicious. Please try again.');
      }
    } catch (err) {
      if (err instanceof BadRequestException) throw err;
      throw new BadRequestException('CAPTCHA verification failed. Please try again.');
    }
  }
}
