import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { FoodDiaryEntry } from './entities/food-diary-entry.entity';
import { FoodDiaryController } from './controllers/food-diary.controller';
import { FoodDiaryService } from './services/food-diary.service';
import { FoodDiaryRepository } from './repositories/food-diary.repository';

@Module({
  imports: [TypeOrmModule.forFeature([FoodDiaryEntry])],
  controllers: [FoodDiaryController],
  providers: [FoodDiaryService, FoodDiaryRepository],
  exports: [FoodDiaryService],
})
export class FoodDiaryModule {}
