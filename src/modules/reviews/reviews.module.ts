import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Review } from './entities/review.entity';
import { Recipe } from '@modules/recipes/entities/recipe.entity';
import { Dietitian } from '@modules/dietitians/entities/dietitian.entity';
import { ReviewsController } from './controllers/reviews.controller';
import { ReviewsService } from './services/reviews.service';
import { ReviewsRepository } from './repositories/reviews.repository';

@Module({
  imports: [TypeOrmModule.forFeature([Review, Recipe, Dietitian])],
  controllers: [ReviewsController],
  providers: [ReviewsService, ReviewsRepository],
  exports: [ReviewsService],
})
export class ReviewsModule {}
