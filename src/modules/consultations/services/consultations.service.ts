import { Injectable, NotFoundException } from '@nestjs/common';
import { ConsultationsRepository } from '../repositories/consultations.repository';
import { CreateConsultationDto } from '../dto/create-consultation.dto';
import { RescheduleConsultationDto } from '../dto/reschedule-consultation.dto';
import { AppointmentStatus, ConsultationType } from '@common/enums';
import { PaginationDto } from '@common/dto';
import { paginate, paginationOffset } from '@common/utils';
import { ERROR_MESSAGES } from '@common/constants';
import { UsersService } from '@modules/users/services/users.service';
import { Consultation } from '../entities/consultation.entity';

@Injectable()
export class ConsultationsService {
  constructor(
    private readonly consultationsRepo: ConsultationsRepository,
    private readonly usersService: UsersService,
  ) {}

  async book(userId: string, dto: CreateConsultationDto) {
    const consultation = await this.consultationsRepo.create({
      ...dto,
      userId,
      type: dto.type ?? ConsultationType.VIDEO,
      status: AppointmentStatus.PENDING,
      scheduledAt: new Date(dto.scheduledAt),
    });
    return this.enrichOne(consultation);
  }

  async findOrFail(id: string) {
    const consultation = await this.consultationsRepo.findById(id);
    if (!consultation) throw new NotFoundException(ERROR_MESSAGES.CONSULTATION.NOT_FOUND);
    return consultation;
  }

  async findOneEnriched(id: string) {
    return this.enrichOne(await this.findOrFail(id));
  }

  async getMyConsultations(userId: string, pagination: PaginationDto) {
    const { page, limit } = pagination;
    const { skip, take } = paginationOffset(page, limit);
    const [data, total] = await this.consultationsRepo.findByUserId(userId, skip, take);
    return paginate(await this.enrichMany(data), total, page, limit);
  }

  async getDietitianConsultations(dietitianId: string, pagination: PaginationDto) {
    const { page, limit } = pagination;
    const { skip, take } = paginationOffset(page, limit);
    const [data, total] = await this.consultationsRepo.findByDietitianId(dietitianId, skip, take);
    return paginate(await this.enrichMany(data), total, page, limit);
  }

  async reschedule(id: string, dto: RescheduleConsultationDto) {
    await this.findOrFail(id);
    await this.consultationsRepo.update(id, {
      scheduledAt: new Date(dto.scheduledAt),
      ...(dto.plan && { plan: dto.plan }),
      ...(dto.duration && { duration: dto.duration }),
      ...(dto.fee != null && { fee: dto.fee }),
      ...(dto.sessionFor && { sessionFor: dto.sessionFor }),
      ...(dto.notes && { notes: dto.notes }),
      status: AppointmentStatus.RESCHEDULED,
    });
    return this.findOneEnriched(id);
  }

  async cancel(id: string, reason?: string) {
    await this.findOrFail(id);
    await this.consultationsRepo.update(id, {
      status: AppointmentStatus.CANCELLED,
      ...(reason && { cancellationReason: reason }),
    });
    return this.findOneEnriched(id);
  }

  async updateStatus(id: string, status: AppointmentStatus) {
    await this.consultationsRepo.update(id, { status });
    return this.findOneEnriched(id);
  }

  // ─── Enrichment (consultant + booking user display info) ────────────────────
  private async enrichOne(c: Consultation) {
    const [dietitian, user] = await Promise.all([
      this.usersService.findById(c.dietitianId).catch(() => null),
      this.usersService.findById(c.userId).catch(() => null),
    ]);
    return { ...c, dietitian: this.userShape(dietitian), user: this.userShape(user) };
  }

  private async enrichMany(items: Consultation[]) {
    if (items.length === 0) return [];
    const ids = new Set<string>();
    items.forEach((c) => {
      ids.add(c.dietitianId);
      ids.add(c.userId);
    });
    const users = new Map<string, any>();
    await Promise.all(
      [...ids].map(async (id) => {
        const u = await this.usersService.findById(id).catch(() => null);
        if (u) users.set(id, u);
      }),
    );
    return items.map((c) => ({
      ...c,
      dietitian: this.userShape(users.get(c.dietitianId)),
      user: this.userShape(users.get(c.userId)),
    }));
  }

  private userShape(u: any) {
    if (!u) return null;
    return { id: u.id, fullName: u.fullName, profilePhoto: u.profilePhoto, role: u.role };
  }
}
