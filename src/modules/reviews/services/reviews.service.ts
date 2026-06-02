import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ReviewsRepository } from '../repositories/reviews.repository';
import { CreateReviewDto } from '../dto/create-review.dto';
import { ReviewTargetType } from '../entities/review.entity';
import { Recipe } from '@modules/recipes/entities/recipe.entity';
import { Dietitian } from '@modules/dietitians/entities/dietitian.entity';
import { PaginationDto } from '@common/dto';
import { paginate, paginationOffset } from '@common/utils';
import { ERROR_MESSAGES } from '@common/constants';

@Injectable()
export class ReviewsService {
  constructor(
    private readonly reviewsRepo: ReviewsRepository,
    @InjectRepository(Recipe) private readonly recipeRepo: Repository<Recipe>,
    @InjectRepository(Dietitian) private readonly dietitianRepo: Repository<Dietitian>,
  ) {}

  async submit(reviewerId: string, dto: CreateReviewDto) {
    const review = await this.reviewsRepo.create({ ...dto, reviewerId });
    await this.recomputeTargetRating(dto.targetId, dto.targetType);
    return review;
  }

  async listByTarget(targetId: string, targetType: ReviewTargetType, pagination: PaginationDto) {
    const { page, limit } = pagination;
    const { skip, take } = paginationOffset(page, limit);
    const [data, total] = await this.reviewsRepo.findByTarget(targetId, targetType, skip, take);
    const aggregate = await this.reviewsRepo.getAggregateForTarget(targetId, targetType);
    return {
      ...paginate(data, total, page, limit),
      aggregate: { rating: aggregate.avg, count: aggregate.count },
    };
  }

  async listByReviewer(reviewerId: string, pagination: PaginationDto) {
    const { page, limit } = pagination;
    const { skip, take } = paginationOffset(page, limit);
    const [data, total] = await this.reviewsRepo.findByReviewer(reviewerId, skip, take);
    return paginate(data, total, page, limit);
  }

  async remove(id: string) {
    const review = await this.reviewsRepo.findById(id);
    if (!review) throw new NotFoundException(ERROR_MESSAGES.REVIEW.NOT_FOUND);
    await this.reviewsRepo.delete(id);
    await this.recomputeTargetRating(review.targetId, review.targetType);
    return { message: 'Review deleted.' };
  }

  private async recomputeTargetRating(targetId: string, targetType: ReviewTargetType) {
    const { avg, count } = await this.reviewsRepo.getAggregateForTarget(targetId, targetType);
    if (targetType === ReviewTargetType.RECIPE) {
      await this.recipeRepo.update(targetId, { rating: avg, reviewCount: count });
    } else {
      await this.dietitianRepo.update(targetId, { rating: avg, reviewCount: count });
    }
  }
}
