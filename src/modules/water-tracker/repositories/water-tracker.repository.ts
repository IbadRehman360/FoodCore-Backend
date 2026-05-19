import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Between, Repository } from 'typeorm';
import { WaterLog } from '../entities/water-log.entity';
import { WaterReminder } from '../entities/water-reminder.entity';

@Injectable()
export class WaterTrackerRepository {
  constructor(
    @InjectRepository(WaterLog) private readonly logRepo: Repository<WaterLog>,
    @InjectRepository(WaterReminder) private readonly reminderRepo: Repository<WaterReminder>,
  ) {}

  // ─── Logs ────────────────────────────────────────────────────────────────
  findLogById(id: string) {
    return this.logRepo.findOne({ where: { id } });
  }

  findLogsByDate(userId: string, date: string) {
    return this.logRepo.find({
      where: { userId, date: new Date(date) },
      order: { createdAt: 'ASC' },
    });
  }

  findLogsRange(userId: string, from: Date, to: Date) {
    return this.logRepo.find({
      where: { userId, date: Between(from, to) },
      order: { date: 'ASC', createdAt: 'ASC' },
    });
  }

  createLog(data: Partial<WaterLog>) {
    return this.logRepo.save(this.logRepo.create(data));
  }

  deleteLog(userId: string, id: string) {
    return this.logRepo.softDelete({ id, userId });
  }

  // ─── Reminders ───────────────────────────────────────────────────────────
  findReminder(userId: string) {
    return this.reminderRepo.findOne({ where: { userId } });
  }

  upsertReminder(data: Partial<WaterReminder>) {
    return this.reminderRepo.upsert(this.reminderRepo.create(data), ['userId']);
  }
}
