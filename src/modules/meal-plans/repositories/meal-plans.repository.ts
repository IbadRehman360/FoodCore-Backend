import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { MealPlan } from '../entities/meal-plan.entity';

@Injectable()
export class MealPlansRepository {
  constructor(@InjectRepository(MealPlan) private readonly repo: Repository<MealPlan>) {}

  findById(id: string) {
    return this.repo.findOne({ where: { id } });
  }

  findByUserId(userId: string, skip: number, take: number) {
    return this.repo.findAndCount({ where: { userId }, skip, take, order: { createdAt: 'DESC' } });
  }

  create(data: Partial<MealPlan>) {
    return this.repo.save(this.repo.create(data));
  }

  update(id: string, data: Partial<MealPlan>) {
    return this.repo.update(id, data);
  }

  delete(id: string) {
    return this.repo.softDelete(id);
  }
}
