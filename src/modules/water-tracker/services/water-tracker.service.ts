import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { WaterTrackerRepository } from '../repositories/water-tracker.repository';
import { LogWaterDto } from '../dto/log-water.dto';
import { SetWaterGoalDto } from '../dto/set-water-goal.dto';
import { SetWaterRemindersDto } from '../dto/set-water-reminders.dto';
import { UsersService } from '@modules/users/services/users.service';
import { ERROR_MESSAGES } from '@common/constants';

@Injectable()
export class WaterTrackerService {
  constructor(
    private readonly waterRepo: WaterTrackerRepository,
    private readonly usersService: UsersService,
  ) {}

  // ─── Logging ─────────────────────────────────────────────────────────────
  async log(userId: string, dto: LogWaterDto) {
    return this.waterRepo.createLog({
      userId,
      amount: dto.amount,
      date: new Date(dto.date),
      source: dto.source,
    });
  }

  getByDate(userId: string, date: string) {
    return this.waterRepo.findLogsByDate(userId, date);
  }

  async getDailySummary(userId: string, date: string) {
    const [logs, user] = await Promise.all([
      this.waterRepo.findLogsByDate(userId, date),
      this.usersService.findById(userId),
    ]);
    const goal = user?.waterGoal ?? 2000;
    const totalMl = logs.reduce((s, l) => s + l.amount, 0);
    const remaining = Math.max(0, goal - totalMl);
    const percent = goal > 0 ? Math.min(100, Math.round((totalMl / goal) * 100)) : 0;
    return { date, goal, totalMl, remaining, percent, entryCount: logs.length };
  }

  async getHistory(userId: string, days: number) {
    const safeDays = Math.min(Math.max(days, 1), 90);
    const to = new Date();
    const from = new Date();
    from.setDate(to.getDate() - safeDays + 1);
    from.setHours(0, 0, 0, 0);
    const [logs, user] = await Promise.all([
      this.waterRepo.findLogsRange(userId, from, to),
      this.usersService.findById(userId),
    ]);
    const goal = user?.waterGoal ?? 2000;

    const byDate = new Map<string, number>();
    for (const log of logs) {
      const key = log.date.toISOString().split('T')[0];
      byDate.set(key, (byDate.get(key) ?? 0) + log.amount);
    }

    const days_: { date: string; totalMl: number; metGoal: boolean }[] = [];
    for (let i = 0; i < safeDays; i++) {
      const d = new Date(from);
      d.setDate(from.getDate() + i);
      const key = d.toISOString().split('T')[0];
      const totalMl = byDate.get(key) ?? 0;
      days_.push({ date: key, totalMl, metGoal: totalMl >= goal });
    }
    return { goal, days: days_ };
  }

  async deleteLog(userId: string, id: string) {
    const log = await this.waterRepo.findLogById(id);
    if (!log || log.userId !== userId) {
      throw new NotFoundException(ERROR_MESSAGES.WATER_LOG.NOT_FOUND);
    }
    await this.waterRepo.deleteLog(userId, id);
    return { message: 'Water log deleted.' };
  }

  // ─── Goal ────────────────────────────────────────────────────────────────
  async getGoal(userId: string) {
    const user = await this.usersService.findById(userId);
    return { goal: user?.waterGoal ?? 2000 };
  }

  async setGoal(userId: string, dto: SetWaterGoalDto) {
    await this.usersService.setWaterGoal(userId, dto.goal);
    return { goal: dto.goal };
  }

  // ─── Reminders ───────────────────────────────────────────────────────────
  async getReminders(userId: string) {
    const existing = await this.waterRepo.findReminder(userId);
    if (existing) return existing;
    return {
      userId,
      enabled: false,
      times: [],
      intervalMinutes: 60,
      timezone: 'Africa/Casablanca',
    };
  }

  async setReminders(userId: string, dto: SetWaterRemindersDto) {
    if (dto.enabled && (!dto.times || dto.times.length === 0) && !dto.intervalMinutes) {
      throw new BadRequestException('Provide either times[] or intervalMinutes when enabling reminders.');
    }
    await this.waterRepo.upsertReminder({
      userId,
      enabled: dto.enabled,
      times: dto.times ?? [],
      intervalMinutes: dto.intervalMinutes ?? 60,
      timezone: dto.timezone ?? 'Africa/Casablanca',
    });
    return this.waterRepo.findReminder(userId);
  }
}
