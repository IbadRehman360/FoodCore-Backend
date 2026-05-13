import { Injectable, NotFoundException } from '@nestjs/common';
import { MealPlansRepository } from '../repositories/meal-plans.repository';
import { CreateMealPlanDto } from '../dto/create-meal-plan.dto';
import { PaginationDto } from '@common/dto';
import { paginate, paginationOffset } from '@common/utils';
import { ERROR_MESSAGES } from '@common/constants';

@Injectable()
export class MealPlansService {
  constructor(private readonly mealPlansRepo: MealPlansRepository) {}

  async create(userId: string, dto: CreateMealPlanDto) {
    return this.mealPlansRepo.create({
      ...dto,
      userId,
      startDate: new Date(dto.startDate),
      endDate: new Date(dto.endDate),
    });
  }

  async findAll(userId: string, pagination: PaginationDto) {
    const { page, limit } = pagination;
    const { skip, take } = paginationOffset(page, limit);
    const [data, total] = await this.mealPlansRepo.findByUserId(userId, skip, take);
    return paginate(data, total, page, limit);
  }

  async findOrFail(id: string) {
    const plan = await this.mealPlansRepo.findById(id);
    if (!plan) throw new NotFoundException(ERROR_MESSAGES.MEAL_PLAN.NOT_FOUND);
    return plan;
  }

  async update(id: string, dto: Partial<CreateMealPlanDto>) {
    await this.mealPlansRepo.update(id, dto as any);
    return this.findOrFail(id);
  }

  async remove(id: string) {
    await this.findOrFail(id);
    await this.mealPlansRepo.delete(id);
    return { message: 'Meal plan deleted.' };
  }
}
