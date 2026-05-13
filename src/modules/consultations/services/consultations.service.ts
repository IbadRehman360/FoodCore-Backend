import { Injectable, NotFoundException } from '@nestjs/common';
import { ConsultationsRepository } from '../repositories/consultations.repository';
import { CreateConsultationDto } from '../dto/create-consultation.dto';
import { AppointmentStatus } from '@common/enums';
import { PaginationDto } from '@common/dto';
import { paginate, paginationOffset } from '@common/utils';
import { ERROR_MESSAGES } from '@common/constants';

@Injectable()
export class ConsultationsService {
  constructor(private readonly consultationsRepo: ConsultationsRepository) {}

  book(userId: string, dto: CreateConsultationDto) {
    return this.consultationsRepo.create({ ...dto, userId, scheduledAt: new Date(dto.scheduledAt) });
  }

  async findOrFail(id: string) {
    const consultation = await this.consultationsRepo.findById(id);
    if (!consultation) throw new NotFoundException(ERROR_MESSAGES.CONSULTATION.NOT_FOUND);
    return consultation;
  }

  async getMyConsultations(userId: string, pagination: PaginationDto) {
    const { page, limit } = pagination;
    const { skip, take } = paginationOffset(page, limit);
    const [data, total] = await this.consultationsRepo.findByUserId(userId, skip, take);
    return paginate(data, total, page, limit);
  }

  async getDietitianConsultations(dietitianId: string, pagination: PaginationDto) {
    const { page, limit } = pagination;
    const { skip, take } = paginationOffset(page, limit);
    const [data, total] = await this.consultationsRepo.findByDietitianId(dietitianId, skip, take);
    return paginate(data, total, page, limit);
  }

  async updateStatus(id: string, status: AppointmentStatus) {
    await this.consultationsRepo.update(id, { status });
    return this.findOrFail(id);
  }

  async cancel(id: string) {
    return this.updateStatus(id, AppointmentStatus.CANCELLED);
  }
}
