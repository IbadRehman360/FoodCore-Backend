import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Food } from './entities/food.entity';
import { FoodsController } from './controllers/foods.controller';
import { FoodsService } from './services/foods.service';
import { FoodsRepository } from './repositories/foods.repository';

@Module({
  imports: [TypeOrmModule.forFeature([Food])],
  controllers: [FoodsController],
  providers: [FoodsService, FoodsRepository],
  exports: [FoodsService],
})
export class FoodsModule {}
