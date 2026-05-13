import { Injectable, NotFoundException } from '@nestjs/common';
import { FoodDiaryRepository } from '../repositories/food-diary.repository';
import { CreateFoodDiaryEntryDto } from '../dto/create-food-diary-entry.dto';
import { PaginationDto } from '@common/dto';
import { paginate, paginationOffset } from '@common/utils';
import { ERROR_MESSAGES } from '@common/constants';

@Injectable()
export class FoodDiaryService {
  constructor(private readonly foodDiaryRepo: FoodDiaryRepository) {}

  create(userId: string, dto: CreateFoodDiaryEntryDto) {
    return this.foodDiaryRepo.create({ ...dto, userId, date: new Date(dto.date) });
  }

  getByDate(userId: string, date: string) {
    return this.foodDiaryRepo.findByUserIdAndDate(userId, date);
  }

  async getHistory(userId: string, pagination: PaginationDto) {
    const { page, limit } = pagination;
    const { skip, take } = paginationOffset(page, limit);
    const [data, total] = await this.foodDiaryRepo.findByUserId(userId, skip, take);
    return paginate(data, total, page, limit);
  }

  async findOrFail(id: string) {
    const entry = await this.foodDiaryRepo.findById(id);
    if (!entry) throw new NotFoundException(ERROR_MESSAGES.FOOD_DIARY.NOT_FOUND);
    return entry;
  }

  async update(id: string, dto: Partial<CreateFoodDiaryEntryDto>) {
    await this.foodDiaryRepo.update(id, dto as any);
    return this.findOrFail(id);
  }

  async remove(id: string) {
    await this.findOrFail(id);
    await this.foodDiaryRepo.delete(id);
    return { message: 'Entry deleted.' };
  }
}
