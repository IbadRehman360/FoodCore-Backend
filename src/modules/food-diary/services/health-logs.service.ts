import { BadRequestException, Injectable } from '@nestjs/common';
import { HealthLogsRepository } from '../repositories/health-logs.repository';
import { LogWeightDto } from '../dto/log-weight.dto';
import { LogSymptomDto } from '../dto/log-symptom.dto';

@Injectable()
export class HealthLogsService {
  constructor(private readonly repo: HealthLogsRepository) {}

  // ─── Weight ──────────────────────────────────────────────────────────────
  async logWeight(userId: string, dto: LogWeightDto) {
    await this.repo.upsertWeight({
      userId,
      date: new Date(dto.date),
      weight: dto.weight,
      notes: dto.notes,
    });
    return this.repo.findWeightByDate(userId, dto.date);
  }

  async getWeightHistory(userId: string, days: number) {
    const safeDays = Math.min(Math.max(days, 1), 365);
    const to = new Date();
    const from = new Date();
    from.setDate(to.getDate() - safeDays + 1);
    from.setHours(0, 0, 0, 0);
    const logs = await this.repo.findWeightRange(userId, from, to);
    const latest = logs[logs.length - 1];
    const first = logs[0];
    const change = latest && first ? +(latest.weight - first.weight).toFixed(2) : 0;
    return { days: safeDays, change, logs };
  }

  async deleteWeight(userId: string, id: string) {
    const result = await this.repo.deleteWeight(userId, id);
    if (!result.affected) throw new BadRequestException('Weight log not found.');
    return { message: 'Weight log deleted.' };
  }

  // ─── Symptoms ────────────────────────────────────────────────────────────
  logSymptom(userId: string, dto: LogSymptomDto) {
    return this.repo.createSymptom({
      userId,
      date: new Date(dto.date),
      symptoms: dto.symptoms,
      severity: dto.severity ?? 0,
      notes: dto.notes,
    });
  }

  async getSymptomHistory(userId: string, days: number) {
    const safeDays = Math.min(Math.max(days, 1), 365);
    const to = new Date();
    const from = new Date();
    from.setDate(to.getDate() - safeDays + 1);
    from.setHours(0, 0, 0, 0);
    const logs = await this.repo.findSymptomsRange(userId, from, to);
    return { days: safeDays, logs };
  }

  async deleteSymptom(userId: string, id: string) {
    const result = await this.repo.deleteSymptom(userId, id);
    if (!result.affected) throw new BadRequestException('Symptom log not found.');
    return { message: 'Symptom log deleted.' };
  }
}
