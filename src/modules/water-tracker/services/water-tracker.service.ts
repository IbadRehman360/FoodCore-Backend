import { Injectable, NotFoundException } from '@nestjs/common';
import { WaterTrackerRepository } from '../repositories/water-tracker.repository';
import { LogWaterDto } from '../dto/log-water.dto';
import { PaginationDto } from '@common/dto';
import { paginate, paginationOffset } from '@common/utils';
import { ERROR_MESSAGES } from '@common/constants';

@Injectable()
export class WaterTrackerService {
  constructor(private readonly waterTrackerRepo: WaterTrackerRepository) {}

  log(userId: string, dto: LogWaterDto) {
    return this.waterTrackerRepo.create({ ...dto, userId, date: new Date(dto.date) });
  }

  getByDate(userId: string, date: string) {
    return this.waterTrackerRepo.findByUserIdAndDate(userId, date);
  }

  async getHistory(userId: string, pagination: PaginationDto) {
    const { page, limit } = pagination;
    const { skip, take } = paginationOffset(page, limit);
    const [data, total] = await this.waterTrackerRepo.findByUserId(userId, skip, take);
    return paginate(data, total, page, limit);
  }

  async remove(id: string) {
    const log = await this.waterTrackerRepo.findById(id);
    if (!log) throw new NotFoundException(ERROR_MESSAGES.WATER_LOG.NOT_FOUND);
    await this.waterTrackerRepo.delete(id);
    return { message: 'Water log deleted.' };
  }
}
