import { Injectable, NotFoundException } from '@nestjs/common';
import { ReviewsRepository } from '../repositories/reviews.repository';
import { CreateReviewDto } from '../dto/create-review.dto';
import { ReviewTargetType } from '../entities/review.entity';
import { PaginationDto } from '@common/dto';
import { paginate, paginationOffset } from '@common/utils';
import { ERROR_MESSAGES } from '@common/constants';

@Injectable()
export class ReviewsService {
  constructor(private readonly reviewsRepo: ReviewsRepository) {}

  submit(reviewerId: string, dto: CreateReviewDto) {
    return this.reviewsRepo.create({ ...dto, reviewerId });
  }

  async listByTarget(targetId: string, targetType: ReviewTargetType, pagination: PaginationDto) {
    const { page, limit } = pagination;
    const { skip, take } = paginationOffset(page, limit);
    const [data, total] = await this.reviewsRepo.findByTarget(targetId, targetType, skip, take);
    return paginate(data, total, page, limit);
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
    return { message: 'Review deleted.' };
  }
}
