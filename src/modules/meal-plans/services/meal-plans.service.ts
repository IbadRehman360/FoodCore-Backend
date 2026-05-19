import { BadRequestException, ForbiddenException, Injectable, NotFoundException } from '@nestjs/common';
import { MealPlansRepository } from '../repositories/meal-plans.repository';
import { CreateMealPlanDto } from '../dto/create-meal-plan.dto';
import { CreateMealPlanItemDto } from '../dto/create-meal-plan-item.dto';
import { AssignMealPlanDto } from '../dto/assign-meal-plan.dto';
import { FoodsService } from '@modules/foods/services/foods.service';
import { MealPlanStatus } from '../entities/meal-plan.entity';
import { MealPlanItem } from '../entities/meal-plan-item.entity';
import { PaginationDto } from '@common/dto';
import { paginate, paginationOffset } from '@common/utils';
import { ERROR_MESSAGES } from '@common/constants';

@Injectable()
export class MealPlansService {
  constructor(
    private readonly mealPlansRepo: MealPlansRepository,
    private readonly foodsService: FoodsService,
  ) {}

  // ─── Dietitian: create + edit ────────────────────────────────────────────

  createDraft(dietitianId: string, dto: CreateMealPlanDto) {
    return this.mealPlansRepo.create({
      title: dto.title,
      description: dto.description,
      planType: dto.planType,
      dietitianId,
      isTemplate: dto.isTemplate ?? false,
      status: MealPlanStatus.DRAFT,
      startDate: dto.startDate ? new Date(dto.startDate) : null,
      endDate: dto.endDate ? new Date(dto.endDate) : null,
    });
  }

  async updateDraft(dietitianId: string, id: string, dto: Partial<CreateMealPlanDto>) {
    const plan = await this.requireOwnedByDietitian(id, dietitianId);
    if (plan.status === MealPlanStatus.ASSIGNED || plan.status === MealPlanStatus.COMPLETED) {
      throw new BadRequestException('Cannot edit a plan that is already assigned.');
    }
    const update: any = {};
    if (dto.title !== undefined) update.title = dto.title;
    if (dto.description !== undefined) update.description = dto.description;
    if (dto.planType !== undefined) update.planType = dto.planType;
    if (dto.startDate !== undefined) update.startDate = dto.startDate ? new Date(dto.startDate) : null;
    if (dto.endDate !== undefined) update.endDate = dto.endDate ? new Date(dto.endDate) : null;
    if (dto.isTemplate !== undefined) update.isTemplate = dto.isTemplate;
    await this.mealPlansRepo.update(id, update);
    return this.findOrFail(id);
  }

  async addItem(dietitianId: string, planId: string, dto: CreateMealPlanItemDto) {
    const plan = await this.requireOwnedByDietitian(planId, dietitianId);
    if (plan.status === MealPlanStatus.ASSIGNED || plan.status === MealPlanStatus.COMPLETED) {
      throw new BadRequestException('Cannot modify items on an assigned plan.');
    }
    const quantity = dto.quantity ?? 1;
    const payload: Partial<MealPlanItem> = {
      planId,
      mealType: dto.mealType,
      dayOffset: dto.dayOffset ?? 0,
      quantity,
      notes: dto.notes,
    };

    if (dto.foodId) {
      const food = await this.foodsService.findOrFail(dto.foodId);
      payload.foodId = food.id;
      payload.foodName = food.name;
      payload.servingUnit = food.servingUnit;
      payload.calories = +(food.calories * quantity).toFixed(2);
      payload.protein = +(food.protein * quantity).toFixed(2);
      payload.carbs = +(food.carbs * quantity).toFixed(2);
      payload.fat = +(food.fat * quantity).toFixed(2);
    } else {
      if (!dto.foodName) {
        throw new BadRequestException('Either foodId or foodName is required.');
      }
      payload.foodName = dto.foodName;
      payload.calories = (dto.calories ?? 0) * quantity;
      payload.protein = (dto.protein ?? 0) * quantity;
      payload.carbs = (dto.carbs ?? 0) * quantity;
      payload.fat = (dto.fat ?? 0) * quantity;
    }
    return this.mealPlansRepo.addItem(payload);
  }

  async removeItem(dietitianId: string, planId: string, itemId: string) {
    const plan = await this.requireOwnedByDietitian(planId, dietitianId);
    if (plan.status === MealPlanStatus.ASSIGNED || plan.status === MealPlanStatus.COMPLETED) {
      throw new BadRequestException('Cannot modify items on an assigned plan.');
    }
    const item = await this.mealPlansRepo.findItem(itemId);
    if (!item || item.planId !== planId) {
      throw new NotFoundException('Meal plan item not found.');
    }
    await this.mealPlansRepo.deleteItem(itemId);
    return { message: 'Item removed.' };
  }

  // ─── Dietitian: publish + assign ─────────────────────────────────────────

  async publish(dietitianId: string, planId: string) {
    const plan = await this.requireOwnedByDietitian(planId, dietitianId);
    if (plan.status !== MealPlanStatus.DRAFT) {
      throw new BadRequestException('Only draft plans can be published.');
    }
    if (!plan.items || plan.items.length === 0) {
      throw new BadRequestException('Cannot publish an empty plan. Add meal items first.');
    }
    await this.mealPlansRepo.update(planId, {
      status: MealPlanStatus.PUBLISHED,
      publishedAt: new Date(),
    });
    return this.findOrFail(planId);
  }

  async assignToUser(dietitianId: string, planId: string, dto: AssignMealPlanDto) {
    const plan = await this.requireOwnedByDietitian(planId, dietitianId);
    if (plan.status === MealPlanStatus.ASSIGNED) {
      throw new BadRequestException('Plan is already assigned.');
    }
    if (plan.status === MealPlanStatus.DRAFT) {
      throw new BadRequestException('Publish the plan before assigning.');
    }
    await this.mealPlansRepo.update(planId, {
      userId: dto.userId,
      status: MealPlanStatus.ASSIGNED,
      assignedAt: new Date(),
      startDate: dto.startDate ? new Date(dto.startDate) : plan.startDate,
      endDate: dto.endDate ? new Date(dto.endDate) : plan.endDate,
    });
    return this.findOrFail(planId);
  }

  async cancel(dietitianId: string, planId: string) {
    await this.requireOwnedByDietitian(planId, dietitianId);
    await this.mealPlansRepo.update(planId, { status: MealPlanStatus.CANCELLED });
    return this.findOrFail(planId);
  }

  // ─── Dietitian: listing ──────────────────────────────────────────────────

  async listMine(dietitianId: string, pagination: PaginationDto) {
    const { page, limit } = pagination;
    const { skip, take } = paginationOffset(page, limit);
    const [data, total] = await this.mealPlansRepo.findByDietitian(dietitianId, skip, take);
    return paginate(data, total, page, limit);
  }

  // ─── User: viewing ───────────────────────────────────────────────────────

  async listAssignedToUser(userId: string, pagination: PaginationDto) {
    const { page, limit } = pagination;
    const { skip, take } = paginationOffset(page, limit);
    const [data, total] = await this.mealPlansRepo.findAssignedToUser(userId, skip, take);
    return paginate(data, total, page, limit);
  }

  async getActivePlanForUser(userId: string) {
    const plans = await this.mealPlansRepo.findActiveForUser(userId);
    return plans[0] ?? null;
  }

  async getTodayForUser(userId: string) {
    const plans = await this.mealPlansRepo.findActiveForUser(userId);
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const items: any[] = [];
    for (const plan of plans) {
      if (!plan.startDate) continue;
      const start = new Date(plan.startDate);
      start.setHours(0, 0, 0, 0);
      const dayOffset = Math.floor((today.getTime() - start.getTime()) / 86_400_000);
      if (dayOffset < 0) continue;
      if (plan.endDate) {
        const end = new Date(plan.endDate);
        end.setHours(0, 0, 0, 0);
        if (today.getTime() > end.getTime()) continue;
      }
      const todaysItems = (plan.items ?? []).filter((i) => i.dayOffset === dayOffset);
      items.push(...todaysItems.map((i) => ({ ...i, planTitle: plan.title, planId: plan.id })));
    }
    return { date: today.toISOString().split('T')[0], items };
  }

  // ─── Shared ──────────────────────────────────────────────────────────────

  async findOrFail(id: string) {
    const plan = await this.mealPlansRepo.findById(id);
    if (!plan) throw new NotFoundException(ERROR_MESSAGES.MEAL_PLAN.NOT_FOUND);
    return plan;
  }

  async getById(viewerId: string, id: string) {
    const plan = await this.findOrFail(id);
    if (plan.dietitianId !== viewerId && plan.userId !== viewerId) {
      throw new ForbiddenException('You do not have access to this plan.');
    }
    return plan;
  }

  async remove(dietitianId: string, id: string) {
    const plan = await this.requireOwnedByDietitian(id, dietitianId);
    if (plan.status === MealPlanStatus.ASSIGNED) {
      throw new BadRequestException('Cancel an assigned plan instead of deleting.');
    }
    await this.mealPlansRepo.delete(id);
    return { message: 'Meal plan deleted.' };
  }

  // ─── Helpers ─────────────────────────────────────────────────────────────

  private async requireOwnedByDietitian(planId: string, dietitianId: string) {
    const plan = await this.findOrFail(planId);
    if (plan.dietitianId !== dietitianId) {
      throw new ForbiddenException('You do not own this meal plan.');
    }
    return plan;
  }
}
