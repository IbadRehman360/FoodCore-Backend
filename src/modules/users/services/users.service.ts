import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { UsersRepository } from '../repositories/users.repository';
import { UpdateProfileDto } from '../dto/update-profile.dto';
import { SetupProfileDto } from '../dto/setup-profile.dto';
import { HealthProfileDto } from '../dto/health-profile.dto';
import { ChangePasswordDto } from '../dto/change-password.dto';
import { AccountStatus, Role } from '@common/enums';
import { hashPassword, comparePassword, paginate, paginationOffset } from '@common/utils';
import { PaginationDto } from '@common/dto';
import { ERROR_MESSAGES } from '@common/constants';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class UsersService {
  constructor(
    private readonly usersRepo: UsersRepository,
    private readonly config: ConfigService,
  ) {}

  findById(id: string) {
    return this.usersRepo.findById(id);
  }

  findByEmail(email: string) {
    return this.usersRepo.findByEmailWithPassword(email);
  }

  findByEmailOrUsername(email: string, username: string) {
    return this.usersRepo.findByEmailOrUsername(email, username);
  }

  create(data: any) {
    return this.usersRepo.create(data);
  }

  createSocialUser(data: any) {
    return this.usersRepo.create({
      email: data.email,
      fullName: `${data.firstName ?? ''} ${data.lastName ?? ''}`.trim() || data.email.split('@')[0],
      username: null,
      provider: data.provider,
      referralCode: data.referralCode,
      status: AccountStatus.ACTIVE,
    });
  }

  async markVerified(id: string) {
    return this.usersRepo.update(id, { status: AccountStatus.ACTIVE, otp: null, otpExpiry: null });
  }

  saveOtp(id: string, otp: string, otpExpiry: Date) {
    return this.usersRepo.update(id, { otp, otpExpiry });
  }

  registerFailedLogin(id: string, attempts: number, lockedUntil: Date | null) {
    return this.usersRepo.update(id, { failedLoginAttempts: attempts, lockedUntil });
  }

  clearLockout(id: string) {
    return this.usersRepo.update(id, { failedLoginAttempts: 0, lockedUntil: null });
  }

  updatePassword(id: string, password: string) {
    return this.usersRepo.update(id, { password, otp: null, otpExpiry: null });
  }

  saveRefreshToken(id: string, refreshToken: string) {
    return this.usersRepo.update(id, { refreshToken });
  }

  clearRefreshToken(id: string) {
    return this.usersRepo.update(id, { refreshToken: null });
  }

  updateRole(id: string, role: Role) {
    return this.usersRepo.update(id, { role });
  }

  async updateProfile(id: string, dto: UpdateProfileDto) {
    await this.usersRepo.update(id, dto as any);
    return this.usersRepo.findById(id);
  }

  async setupProfile(id: string, dto: SetupProfileDto) {
    const { dateOfBirth, ...rest } = dto;
    await this.usersRepo.update(id, {
      ...rest,
      ...(dateOfBirth && { dateOfBirth: new Date(dateOfBirth) }),
      isProfileComplete: true,
    });
    return this.usersRepo.findById(id);
  }

  async updateHealthProfile(id: string, dto: HealthProfileDto) {
    await this.usersRepo.update(id, { ...dto, isHealthProfileComplete: true });
    return this.usersRepo.findById(id);
  }

  async changePassword(id: string, dto: ChangePasswordDto) {
    const user = await this.usersRepo.findByIdWithPassword(id);
    if (!user) throw new NotFoundException(ERROR_MESSAGES.USER.NOT_FOUND);
    const isValid = await comparePassword(dto.currentPassword, user.password ?? '');
    if (!isValid) throw new BadRequestException('Current password is incorrect');
    const hashed = await hashPassword(dto.newPassword);
    await this.usersRepo.update(id, { password: hashed });
    return { message: 'Password changed successfully' };
  }

  async setWaterGoal(id: string, goal: number) {
    await this.usersRepo.update(id, { waterGoal: goal });
    return this.usersRepo.findById(id);
  }

  async updateProfilePhoto(id: string, photoUrl: string) {
    await this.usersRepo.update(id, { profilePhoto: photoUrl });
    return this.usersRepo.findById(id);
  }

  // ─── GDPR ──────────────────────────────────────────────────────────────────

  /** Right to data portability — returns the user's stored personal data. */
  async exportData(id: string) {
    return this.findOrFail(id);
  }

  /**
   * Right to erasure — anonymizes PII (so the email/username can be reused) and
   * soft-deletes the account so it can no longer be found or logged into.
   */
  async deleteAccount(id: string) {
    await this.findOrFail(id);
    await this.usersRepo.update(id, {
      email: `deleted_${id}@deleted.local`,
      username: null,
      fullName: 'Deleted User',
      phone: null,
      profilePhoto: null,
      about: null,
      healthGoals: null,
      mealPersonalization: null,
      refreshToken: null,
    });
    await this.usersRepo.softDelete(id);
    return { message: 'Account deleted successfully.' };
  }

  async getReferral(id: string) {
    const user = await this.findOrFail(id);
    const appUrl = this.config.get<string>('app.frontendUrl');
    return {
      referralCode: user.referralCode,
      referralLink: `${appUrl}/join?ref=${user.referralCode}`,
    };
  }

  async findAll(paginationDto: PaginationDto) {
    const { page, limit } = paginationDto;
    const { skip, take } = paginationOffset(page, limit);
    const [data, total] = await this.usersRepo.findAll(skip, take);
    return paginate(data, total, page, limit);
  }

  async findOrFail(id: string) {
    const user = await this.usersRepo.findById(id);
    if (!user) throw new NotFoundException(ERROR_MESSAGES.USER.NOT_FOUND);
    return user;
  }
}
