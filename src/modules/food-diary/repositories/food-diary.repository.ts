import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { FoodDiaryEntry } from '../entities/food-diary-entry.entity';

@Injectable()
export class FoodDiaryRepository {
  constructor(@InjectRepository(FoodDiaryEntry) private readonly repo: Repository<FoodDiaryEntry>) {}

  findById(id: string) {
    return this.repo.findOne({ where: { id } });
  }

  findByUserIdAndDate(userId: string, date: string) {
    return this.repo.find({ where: { userId, date: new Date(date) }, order: { createdAt: 'ASC' } });
  }

  findByUserId(userId: string, skip: number, take: number) {
    return this.repo.findAndCount({ where: { userId }, skip, take, order: { date: 'DESC' } });
  }

  create(data: Partial<FoodDiaryEntry>) {
    return this.repo.save(this.repo.create(data));
  }

  update(id: string, data: Partial<FoodDiaryEntry>) {
    return this.repo.update(id, data);
  }

  delete(id: string) {
    return this.repo.softDelete(id);
  }
}
