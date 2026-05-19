import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { FoodDiaryRepository } from '../repositories/food-diary.repository';
import { FoodsService } from '@modules/foods/services/foods.service';
import { UsersService } from '@modules/users/services/users.service';
import { CreateFoodDiaryEntryDto } from '../dto/create-food-diary-entry.dto';
import { FoodDiaryEntry } from '../entities/food-diary-entry.entity';
import { MealType } from '@common/enums';
import { ERROR_MESSAGES } from '@common/constants';

const NUTRIENT_FIELDS = [
  'calories',
  'fat', 'saturatedFat', 'transFat', 'protein', 'carbs', 'fiber', 'sugar',
  'addedSugar', 'cholesterol', 'sodium',
  'vitA', 'vitC', 'vitD', 'vitB1', 'vitB2', 'vitB3', 'vitB6', 'vitB12',
  'vitE', 'vitK', 'calcium', 'phosphorus', 'iron', 'potassium', 'magnesium', 'zinc',
] as const;

type Nutrient = (typeof NUTRIENT_FIELDS)[number];

@Injectable()
export class FoodDiaryService {
  constructor(
    private readonly foodDiaryRepo: FoodDiaryRepository,
    private readonly foodsService: FoodsService,
    private readonly usersService: UsersService,
  ) {}

  async create(userId: string, dto: CreateFoodDiaryEntryDto) {
    const quantity = dto.quantity ?? 1;
    const payload: Partial<FoodDiaryEntry> = {
      userId,
      mealType: dto.mealType,
      date: new Date(dto.date),
      quantity,
    };

    if (dto.foodId) {
      const food = await this.foodsService.findOrFail(dto.foodId);
      payload.foodId = food.id;
      payload.foodName = food.name;
      payload.servingUnit = food.servingUnit;
      for (const k of NUTRIENT_FIELDS) {
        (payload as any)[k] = +(((food as any)[k] ?? 0) * quantity).toFixed(2);
      }
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

    return this.foodDiaryRepo.create(payload);
  }

  getByDate(userId: string, date: string) {
    return this.foodDiaryRepo.findByUserIdAndDate(userId, date);
  }

  async getDailySummary(userId: string, date: string) {
    const [entries, user] = await Promise.all([
      this.foodDiaryRepo.findByUserIdAndDate(userId, date),
      this.usersService.findById(userId),
    ]);
    const calorieGoal = user?.calorieGoal ?? 2000;

    const totals: Record<Nutrient, number> = Object.fromEntries(
      NUTRIENT_FIELDS.map((k) => [k, 0]),
    ) as Record<Nutrient, number>;

    const perMeal: Record<MealType, number> = {
      [MealType.BREAKFAST]: 0,
      [MealType.LUNCH]: 0,
      [MealType.DINNER]: 0,
      [MealType.SNACK]: 0,
    };

    for (const e of entries) {
      for (const k of NUTRIENT_FIELDS) {
        totals[k] += Number((e as any)[k] ?? 0);
      }
      perMeal[e.mealType] += Number(e.calories ?? 0);
    }

    for (const k of NUTRIENT_FIELDS) totals[k] = +totals[k].toFixed(2);

    return {
      date,
      calorieGoal,
      caloriesConsumed: totals.calories,
      caloriesRemaining: Math.max(0, calorieGoal - totals.calories),
      perMeal,
      totals,
      entryCount: entries.length,
    };
  }

  async getWeeklyBudget(userId: string, weekStart: string) {
    const start = new Date(weekStart);
    if (isNaN(start.getTime())) {
      throw new BadRequestException('Invalid weekStart date.');
    }
    const user = await this.usersService.findById(userId);
    const calorieGoal = user?.calorieGoal ?? 2000;

    const days: { date: string; calories: number; inBudget: boolean; tracked: boolean }[] = [];
    for (let i = 0; i < 7; i++) {
      const d = new Date(start);
      d.setDate(start.getDate() + i);
      const iso = d.toISOString().split('T')[0];
      const entries = await this.foodDiaryRepo.findByUserIdAndDate(userId, iso);
      const calories = entries.reduce((s, e) => s + Number(e.calories ?? 0), 0);
      days.push({
        date: iso,
        calories: +calories.toFixed(2),
        tracked: entries.length > 0,
        inBudget: entries.length > 0 && calories <= calorieGoal,
      });
    }

    return { weekStart: start.toISOString().split('T')[0], calorieGoal, days };
  }

  async findOrFail(id: string) {
    const entry = await this.foodDiaryRepo.findById(id);
    if (!entry) throw new NotFoundException(ERROR_MESSAGES.FOOD_DIARY.NOT_FOUND);
    return entry;
  }

  async update(id: string, dto: Partial<CreateFoodDiaryEntryDto>) {
    await this.findOrFail(id);
    const update: Partial<FoodDiaryEntry> = {};
    if (dto.mealType !== undefined) update.mealType = dto.mealType;
    if (dto.date !== undefined) update.date = new Date(dto.date);
    if (dto.foodName !== undefined) update.foodName = dto.foodName;
    if (dto.quantity !== undefined) update.quantity = dto.quantity;
    if (dto.calories !== undefined) update.calories = dto.calories;
    if (dto.protein !== undefined) update.protein = dto.protein;
    if (dto.carbs !== undefined) update.carbs = dto.carbs;
    if (dto.fat !== undefined) update.fat = dto.fat;
    await this.foodDiaryRepo.update(id, update);
    return this.findOrFail(id);
  }

  async remove(userId: string, id: string) {
    const entry = await this.findOrFail(id);
    if (entry.userId !== userId) {
      throw new NotFoundException(ERROR_MESSAGES.FOOD_DIARY.NOT_FOUND);
    }
    await this.foodDiaryRepo.delete(id);
    return { message: 'Entry deleted.' };
  }
}
