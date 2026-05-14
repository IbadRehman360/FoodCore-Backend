import {
  Injectable,
  UnauthorizedException,
  BadRequestException,
  ConflictException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { UsersService } from '@modules/users/services/users.service';
import { MailService } from '@modules/mail/mail.service';
import { OtpService } from '@modules/otp/otp.service';
import { RegisterDto } from '../dto/register.dto';
import { CaptchaService } from './captcha.service';
import { LoginDto } from '../dto/login.dto';
import { ResetPasswordDto } from '../dto/reset-password.dto';
import { VerifyOtpDto } from '../dto/verify-otp.dto';
import { comparePassword, hashPassword } from '@common/utils';
import { ERROR_MESSAGES } from '@common/constants';
import { AccountStatus } from '@common/enums';

@Injectable()
export class AuthService {
  constructor(
    private readonly usersService: UsersService,
    private readonly jwtService: JwtService,
    private readonly config: ConfigService,
    private readonly mailService: MailService,
    private readonly otpService: OtpService,
    private readonly captchaService: CaptchaService,
  ) {}

  async register(dto: RegisterDto) {
    await this.captchaService.verify(dto.captchaToken);

    if (dto.password !== dto.confirmPassword) {
      throw new BadRequestException('Passwords do not match.');
    }

    const existing = await this.usersService.findByEmail(dto.email);
    if (existing) throw new ConflictException(ERROR_MESSAGES.USER.EMAIL_TAKEN);

    const hashed = await hashPassword(dto.password);
    const referralCode = this.generateReferralCode();

    await this.usersService.create({
      email: dto.email,
      password: hashed,
      fullName: dto.email.split('@')[0],
      referralCode,
      referredBy: dto.referralCode ?? null,
      status: AccountStatus.PENDING,
    });

    const otp = await this.otpService.generate(dto.email, 'verify');
    console.log(`[DEV] OTP for ${dto.email}: ${otp}`);
    await this.mailService.sendOtpEmail(dto.email, otp, 10);
    await this.otpService.setCooldown(dto.email, 'verify');

    return { message: 'Registration successful. Please check your email for the verification code.' };
  }

  async verifyOtp(dto: VerifyOtpDto) {
    const user = await this.usersService.findByEmail(dto.email);
    if (!user) throw new BadRequestException(ERROR_MESSAGES.USER.NOT_FOUND);

    const valid = await this.otpService.verify(dto.email, 'verify', dto.otp);
    if (!valid) throw new BadRequestException(ERROR_MESSAGES.AUTH.INVALID_OTP);

    await this.usersService.markVerified(user.id);
    const tokens = await this.generateTokenPair(user.id, user.email, user.role);

    return {
      message: 'Email verified successfully.',
      ...tokens,
      nextStep: 'setup-profile',
    };
  }

  async resendOtp(email: string) {
    const user = await this.usersService.findByEmail(email);
    if (!user) return { message: 'If that email exists, a new code has been sent.' };

    const canResend = await this.otpService.canResend(email, 'verify');
    if (!canResend) {
      throw new BadRequestException('Please wait 60 seconds before requesting a new code.');
    }

    const otp = await this.otpService.generate(email, 'verify');
    console.log(`[DEV] Resend OTP for ${email}: ${otp}`);
    await this.mailService.sendOtpEmail(email, otp, 10);
    await this.otpService.setCooldown(email, 'verify');

    return { message: 'A new verification code has been sent to your email.' };
  }

  async login(dto: LoginDto) {
    const user = await this.usersService.findByEmail(dto.email);
    if (!user) throw new UnauthorizedException(ERROR_MESSAGES.AUTH.INVALID_CREDENTIALS);

    if (!user.password) {
      throw new UnauthorizedException('This account uses social login. Please sign in with Google or Apple.');
    }

    const valid = await comparePassword(dto.password, user.password);
    if (!valid) throw new UnauthorizedException(ERROR_MESSAGES.AUTH.INVALID_CREDENTIALS);

    if (user.status === AccountStatus.PENDING) {
      throw new UnauthorizedException(ERROR_MESSAGES.AUTH.ACCOUNT_NOT_VERIFIED);
    }

    if (user.status === AccountStatus.SUSPENDED || user.status === AccountStatus.BANNED) {
      throw new UnauthorizedException(ERROR_MESSAGES.AUTH.ACCOUNT_SUSPENDED);
    }

    const expiresIn = dto.rememberMe
      ? '30d'
      : this.config.get<string>('jwt.expiresIn');

    return this.generateTokenPair(user.id, user.email, user.role, expiresIn);
  }

  async forgotPassword(email: string) {
    const user = await this.usersService.findByEmail(email);
    if (!user) return { message: 'If that email exists, a reset code has been sent.' };

    const canResend = await this.otpService.canResend(email, 'reset');
    if (!canResend) {
      throw new BadRequestException('Please wait 60 seconds before requesting a new code.');
    }

    const otp = await this.otpService.generate(email, 'reset');
    console.log(`[DEV] Reset OTP for ${email}: ${otp}`);
    await this.mailService.sendPasswordResetEmail(email, otp);
    await this.otpService.setCooldown(email, 'reset');

    return { message: 'If that email exists, a reset code has been sent.' };
  }

  async resetPassword(dto: ResetPasswordDto) {
    const user = await this.usersService.findByEmail(dto.email);
    if (!user) throw new BadRequestException(ERROR_MESSAGES.AUTH.INVALID_OTP);

    const valid = await this.otpService.verify(dto.email, 'reset', dto.otp);
    if (!valid) throw new BadRequestException(ERROR_MESSAGES.AUTH.INVALID_OTP);

    const hashed = await hashPassword(dto.newPassword);
    await this.usersService.updatePassword(user.id, hashed);

    return { message: 'Password reset successful. Please log in.' };
  }

  async refreshTokens(refreshToken: string) {
    try {
      const payload = this.jwtService.verify(refreshToken, {
        secret: this.config.get('jwt.refreshSecret'),
      });
      return this.generateTokenPair(payload.sub, payload.email, payload.role);
    } catch {
      throw new UnauthorizedException(ERROR_MESSAGES.AUTH.TOKEN_EXPIRED);
    }
  }

  async socialLogin(socialUser: any) {
    let user = await this.usersService.findByEmail(socialUser.email);

    if (!user) {
      const referralCode = this.generateReferralCode();
      user = await this.usersService.createSocialUser({ ...socialUser, referralCode });
    }

    return {
      ...await this.generateTokenPair(user.id, user.email, user.role),
      isNewUser: !user.isProfileComplete,
      nextStep: user.isProfileComplete ? null : 'setup-profile',
    };
  }

  async logout(userId: string) {
    await this.usersService.clearRefreshToken(userId);
    return { message: 'Logged out successfully.' };
  }

  private async generateTokenPair(sub: string, email: string, role: string, expiresIn?: string) {
    const payload = { sub, email, role };
    const [accessToken, refreshToken] = await Promise.all([
      this.jwtService.signAsync(payload, expiresIn ? { expiresIn } : undefined),
      this.jwtService.signAsync(payload, {
        secret: this.config.get('jwt.refreshSecret'),
        expiresIn: this.config.get('jwt.refreshExpiresIn'),
      }),
    ]);
    await this.usersService.saveRefreshToken(sub, refreshToken);
    return { accessToken, refreshToken };
  }

  private generateReferralCode(): string {
    return 'FC-' + Math.random().toString(36).substring(2, 9).toUpperCase();
  }
}
