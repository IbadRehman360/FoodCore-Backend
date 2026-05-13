import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { MealPlan } from './entities/meal-plan.entity';
import { MealPlansController } from './controllers/meal-plans.controller';
import { MealPlansService } from './services/meal-plans.service';
import { MealPlansRepository } from './repositories/meal-plans.repository';

@Module({
  imports: [TypeOrmModule.forFeature([MealPlan])],
  controllers: [MealPlansController],
  providers: [MealPlansService, MealPlansRepository],
  exports: [MealPlansService],
})
export class MealPlansModule {}
