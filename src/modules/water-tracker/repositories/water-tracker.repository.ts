import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { WaterLog } from '../entities/water-log.entity';

@Injectable()
export class WaterTrackerRepository {
  constructor(@InjectRepository(WaterLog) private readonly repo: Repository<WaterLog>) {}

  findById(id: string) {
    return this.repo.findOne({ where: { id } });
  }

  findByUserIdAndDate(userId: string, date: string) {
    return this.repo.find({ where: { userId, date: new Date(date) } });
  }

  findByUserId(userId: string, skip: number, take: number) {
    return this.repo.findAndCount({ where: { userId }, skip, take, order: { date: 'DESC' } });
  }

  create(data: Partial<WaterLog>) {
    return this.repo.save(this.repo.create(data));
  }

  delete(id: string) {
    return this.repo.softDelete(id);
  }
}
