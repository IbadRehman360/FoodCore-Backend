import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { In, Repository } from 'typeorm';
import { MealPlan, MealPlanStatus } from '../entities/meal-plan.entity';
import { MealPlanItem } from '../entities/meal-plan-item.entity';

@Injectable()
export class MealPlansRepository {
  constructor(
    @InjectRepository(MealPlan) private readonly planRepo: Repository<MealPlan>,
    @InjectRepository(MealPlanItem) private readonly itemRepo: Repository<MealPlanItem>,
  ) {}

  findById(id: string) {
    return this.planRepo.findOne({ where: { id }, relations: ['items'] });
  }

  findByDietitian(dietitianId: string, skip: number, take: number) {
    return this.planRepo.findAndCount({
      where: { dietitianId },
      skip, take,
      order: { createdAt: 'DESC' },
      relations: ['items'],
    });
  }

  findAssignedToUser(userId: string, skip: number, take: number) {
    return this.planRepo.findAndCount({
      where: { userId, status: In([MealPlanStatus.ASSIGNED, MealPlanStatus.COMPLETED]) },
      skip, take,
      order: { startDate: 'DESC' },
      relations: ['items'],
    });
  }

  findActiveForUser(userId: string) {
    return this.planRepo.find({
      where: { userId, status: MealPlanStatus.ASSIGNED },
      relations: ['items'],
      order: { startDate: 'DESC' },
    });
  }

  create(data: Partial<MealPlan>) {
    return this.planRepo.save(this.planRepo.create(data));
  }

  update(id: string, data: Partial<MealPlan>) {
    return this.planRepo.update(id, data);
  }

  delete(id: string) {
    return this.planRepo.softDelete(id);
  }

  // ─── Items ───────────────────────────────────────────────────────────────
  addItem(data: Partial<MealPlanItem>) {
    return this.itemRepo.save(this.itemRepo.create(data));
  }

  findItem(id: string) {
    return this.itemRepo.findOne({ where: { id } });
  }

  updateItem(id: string, data: Partial<MealPlanItem>) {
    return this.itemRepo.update(id, data);
  }

  deleteItem(id: string) {
    return this.itemRepo.softDelete(id);
  }
}
