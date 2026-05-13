import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { DietitiansRepository } from '../repositories/dietitians.repository';
import { UpdateDietitianDto } from '../dto/update-dietitian.dto';
import { SetupBasicProfileDto } from '../dto/setup-basic-profile.dto';
import { SetupProfessionalProfileDto } from '../dto/setup-professional-profile.dto';
import { SetupAvailabilityDto } from '../dto/setup-availability.dto';
import { UsersService } from '@modules/users/services/users.service';
import { VerificationStatus, Role } from '@common/enums';
import { PaginationDto } from '@common/dto';
import { paginate, paginationOffset } from '@common/utils';
import { ERROR_MESSAGES } from '@common/constants';

@Injectable()
export class DietitiansService {
  constructor(
    private readonly dietitiansRepo: DietitiansRepository,
    private readonly usersService: UsersService,
  ) {}

  async register(userId: string) {
    const existing = await this.dietitiansRepo.findByUserId(userId);
    if (existing) throw new BadRequestException(ERROR_MESSAGES.DIETITIAN.ALREADY_REGISTERED);
    await this.usersService.updateRole(userId, Role.DIETITIAN);
    return this.dietitiansRepo.create({ userId });
  }

  async setupBasicProfile(userId: string, dto: SetupBasicProfileDto) {
    await this.usersService.updateProfile(userId, dto as any);
    const dietitian = await this.dietitiansRepo.findByUserId(userId);
    if (dietitian && !dietitian.isBasicProfileComplete) {
      await this.dietitiansRepo.update(dietitian.id, { isBasicProfileComplete: true });
    }
    return this.usersService.findOrFail(userId);
  }

  async setupProfessionalProfile(userId: string, dto: SetupProfessionalProfileDto) {
    const dietitian = await this.findOrFailByUserId(userId);
    const { socialLinks, sessionFees, ...rest } = dto;
    await this.dietitiansRepo.update(dietitian.id, {
      ...rest,
      ...(socialLinks && { socialLinks: socialLinks as Record<string, string> }),
      ...(sessionFees && { sessionFees: sessionFees as Record<string, number> }),
      isProfessionalProfileComplete: true,
    });
    return this.dietitiansRepo.findByUserId(userId);
  }

  async addCertificates(userId: string, fileUrls: string[]) {
    const dietitian = await this.findOrFailByUserId(userId);
    const current = dietitian.certificates ?? [];
    await this.dietitiansRepo.update(dietitian.id, { certificates: [...current, ...fileUrls] });
    return this.dietitiansRepo.findByUserId(userId);
  }

  async setupAvailability(userId: string, dto: SetupAvailabilityDto) {
    const dietitian = await this.findOrFailByUserId(userId);
    const { timezone, ...days } = dto;
    await this.dietitiansRepo.update(dietitian.id, {
      timezone,
      weeklyAvailability: days,
      isAvailabilitySet: true,
    });
    return this.dietitiansRepo.findByUserId(userId);
  }

  async findOrFail(id: string) {
    const d = await this.dietitiansRepo.findById(id);
    if (!d) throw new NotFoundException(ERROR_MESSAGES.DIETITIAN.NOT_FOUND);
    return d;
  }

  async findOrFailByUserId(userId: string) {
    const d = await this.dietitiansRepo.findByUserId(userId);
    if (!d) throw new NotFoundException(ERROR_MESSAGES.DIETITIAN.NOT_FOUND);
    return d;
  }

  findByUserId(userId: string) {
    return this.dietitiansRepo.findByUserId(userId);
  }

  async findAll(pagination: PaginationDto) {
    const { page, limit } = pagination;
    const { skip, take } = paginationOffset(page, limit);
    const [data, total] = await this.dietitiansRepo.findAll(skip, take);
    return paginate(data, total, page, limit);
  }

  async findApproved(pagination: PaginationDto) {
    const { page, limit } = pagination;
    const { skip, take } = paginationOffset(page, limit);
    const [data, total] = await this.dietitiansRepo.findByStatus(VerificationStatus.VERIFIED, skip, take);
    return paginate(data, total, page, limit);
  }

  async findPending(pagination: PaginationDto) {
    const { page, limit } = pagination;
    const { skip, take } = paginationOffset(page, limit);
    const [data, total] = await this.dietitiansRepo.findByStatus(VerificationStatus.PENDING, skip, take);
    return paginate(data, total, page, limit);
  }

  async updateProfile(id: string, dto: UpdateDietitianDto) {
    await this.dietitiansRepo.update(id, dto as any);
    return this.findOrFail(id);
  }

  async approve(id: string) {
    await this.dietitiansRepo.update(id, { verificationStatus: VerificationStatus.VERIFIED });
    return { message: 'Dietitian approved.' };
  }

  async reject(id: string, reason: string) {
    await this.dietitiansRepo.update(id, { verificationStatus: VerificationStatus.REJECTED, adminNotes: reason });
    return { message: 'Dietitian rejected.' };
  }
}
