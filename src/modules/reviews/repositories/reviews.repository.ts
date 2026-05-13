import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Review, ReviewTargetType } from '../entities/review.entity';

@Injectable()
export class ReviewsRepository {
  constructor(@InjectRepository(Review) private readonly repo: Repository<Review>) {}

  findById(id: string) { return this.repo.findOne({ where: { id } }); }
  findByTarget(targetId: string, targetType: ReviewTargetType, skip: number, take: number) {
    return this.repo.findAndCount({ where: { targetId, targetType }, skip, take, order: { createdAt: 'DESC' } });
  }
  findByReviewer(reviewerId: string, skip: number, take: number) {
    return this.repo.findAndCount({ where: { reviewerId }, skip, take, order: { createdAt: 'DESC' } });
  }
  create(data: Partial<Review>) { return this.repo.save(this.repo.create(data)); }
  delete(id: string) { return this.repo.softDelete(id); }
}
