import { Injectable, NotFoundException } from '@nestjs/common';
import { UsersRepository } from '../repositories/users.repository';
import { UpdateProfileDto } from '../dto/update-profile.dto';
import { SetupProfileDto } from '../dto/setup-profile.dto';
import { HealthProfileDto } from '../dto/health-profile.dto';
import { AccountStatus, Role } from '@common/enums';
import { paginate, paginationOffset } from '@common/utils';
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
    await this.usersRepo.update(id, { ...dto, isProfileComplete: true });
    return this.usersRepo.findById(id);
  }

  async updateHealthProfile(id: string, dto: HealthProfileDto) {
    await this.usersRepo.update(id, { ...dto, isHealthProfileComplete: true });
    return this.usersRepo.findById(id);
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
