import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Consultation } from '../entities/consultation.entity';
import { AppointmentStatus } from '@common/enums';

@Injectable()
export class ConsultationsRepository {
  constructor(@InjectRepository(Consultation) private readonly repo: Repository<Consultation>) {}

  findById(id: string) {
    return this.repo.findOne({ where: { id } });
  }

  findByUserId(userId: string, skip: number, take: number) {
    return this.repo.findAndCount({ where: { userId }, skip, take, order: { scheduledAt: 'DESC' } });
  }

  findByDietitianId(dietitianId: string, skip: number, take: number) {
    return this.repo.findAndCount({ where: { dietitianId }, skip, take, order: { scheduledAt: 'DESC' } });
  }

  create(data: Partial<Consultation>) {
    return this.repo.save(this.repo.create(data));
  }

  update(id: string, data: Partial<Consultation>) {
    return this.repo.update(id, data);
  }
}
