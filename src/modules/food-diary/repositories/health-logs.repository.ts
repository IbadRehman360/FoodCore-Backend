import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Between, Repository } from 'typeorm';
import { WeightLog } from '../entities/weight-log.entity';
import { SymptomLog } from '../entities/symptom-log.entity';

@Injectable()
export class HealthLogsRepository {
  constructor(
    @InjectRepository(WeightLog) private readonly weightRepo: Repository<WeightLog>,
    @InjectRepository(SymptomLog) private readonly symptomRepo: Repository<SymptomLog>,
  ) {}

  // ─── Weight ──────────────────────────────────────────────────────────────
  upsertWeight(data: Partial<WeightLog>) {
    return this.weightRepo.upsert(this.weightRepo.create(data), ['userId', 'date']);
  }

  findWeightByDate(userId: string, date: string) {
    return this.weightRepo.findOne({ where: { userId, date: new Date(date) } });
  }

  findWeightRange(userId: string, from: Date, to: Date) {
    return this.weightRepo.find({
      where: { userId, date: Between(from, to) },
      order: { date: 'ASC' },
    });
  }

  deleteWeight(userId: string, id: string) {
    return this.weightRepo.softDelete({ id, userId });
  }

  // ─── Symptoms ────────────────────────────────────────────────────────────
  createSymptom(data: Partial<SymptomLog>) {
    return this.symptomRepo.save(this.symptomRepo.create(data));
  }

  findSymptomById(id: string) {
    return this.symptomRepo.findOne({ where: { id } });
  }

  findSymptomsRange(userId: string, from: Date, to: Date) {
    return this.symptomRepo.find({
      where: { userId, date: Between(from, to) },
      order: { date: 'DESC', createdAt: 'DESC' },
    });
  }

  deleteSymptom(userId: string, id: string) {
    return this.symptomRepo.softDelete({ id, userId });
  }
}
