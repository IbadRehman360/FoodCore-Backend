import { Injectable, NotFoundException, OnModuleInit, Logger } from '@nestjs/common';
import { FoodsRepository } from '../repositories/foods.repository';
import { FOOD_SEED } from '../foods.seed';

@Injectable()
export class FoodsService implements OnModuleInit {
  private readonly logger = new Logger(FoodsService.name);

  constructor(private readonly foodsRepo: FoodsRepository) {}

  async onModuleInit() {
    const existing = await this.foodsRepo.count();
    if (existing === 0) {
      await this.foodsRepo.bulkInsert(FOOD_SEED);
      this.logger.log(`Seeded ${FOOD_SEED.length} foods.`);
    }
  }

  search(query: string) {
    return this.foodsRepo.search(query);
  }

  async findOrFail(id: string) {
    const food = await this.foodsRepo.findById(id);
    if (!food) throw new NotFoundException('Food not found.');
    return food;
  }
}
