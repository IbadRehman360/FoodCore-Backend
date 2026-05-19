import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { FoodDiaryEntry } from './entities/food-diary-entry.entity';
import { WeightLog } from './entities/weight-log.entity';
import { SymptomLog } from './entities/symptom-log.entity';
import { FoodDiaryController } from './controllers/food-diary.controller';
import { HealthLogsController } from './controllers/health-logs.controller';
import { FoodDiaryService } from './services/food-diary.service';
import { HealthLogsService } from './services/health-logs.service';
import { FoodDiaryRepository } from './repositories/food-diary.repository';
import { HealthLogsRepository } from './repositories/health-logs.repository';
import { FoodsModule } from '@modules/foods/foods.module';
import { UsersModule } from '@modules/users/users.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([FoodDiaryEntry, WeightLog, SymptomLog]),
    FoodsModule,
    UsersModule,
  ],
  controllers: [FoodDiaryController, HealthLogsController],
  providers: [FoodDiaryService, HealthLogsService, FoodDiaryRepository, HealthLogsRepository],
  exports: [FoodDiaryService, HealthLogsService],
})
export class FoodDiaryModule {}
