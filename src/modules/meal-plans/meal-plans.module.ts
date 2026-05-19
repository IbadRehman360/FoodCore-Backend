import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { MealPlan } from './entities/meal-plan.entity';
import { MealPlanItem } from './entities/meal-plan-item.entity';
import { MealPlansController } from './controllers/meal-plans.controller';
import { MealPlansDietitianController } from './controllers/meal-plans-dietitian.controller';
import { MealPlansService } from './services/meal-plans.service';
import { MealPlansRepository } from './repositories/meal-plans.repository';
import { FoodsModule } from '@modules/foods/foods.module';

@Module({
  imports: [TypeOrmModule.forFeature([MealPlan, MealPlanItem]), FoodsModule],
  controllers: [MealPlansDietitianController, MealPlansController],
  providers: [MealPlansService, MealPlansRepository],
  exports: [MealPlansService],
})
export class MealPlansModule {}
