import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Review, ReviewTargetType } from '../entities/review.entity';

@Injectable()
export class ReviewsRepository {
  constructor(@InjectRepository(Review) private readonly repo: Repository<Review>) {}

  findById(id: string) { return this.repo.findOne({ where: { id }, relations: ['reviewer'] }); }
  findByTarget(targetId: string, targetType: ReviewTargetType, skip: number, take: number) {
    return this.repo.findAndCount({
      where: { targetId, targetType },
      skip, take,
      relations: ['reviewer'],
      order: { createdAt: 'DESC' },
    });
  }
  findByReviewer(reviewerId: string, skip: number, take: number) {
    return this.repo.findAndCount({ where: { reviewerId }, skip, take, order: { createdAt: 'DESC' } });
  }
  create(data: Partial<Review>) { return this.repo.save(this.repo.create(data)); }
  delete(id: string) { return this.repo.softDelete(id); }

  async getAggregateForTarget(targetId: string, targetType: ReviewTargetType): Promise<{ avg: number; count: number }> {
    const row = await this.repo.createQueryBuilder('r')
      .select('AVG(r.rating)', 'avg')
      .addSelect('COUNT(r.id)', 'count')
      .where('r.targetId = :targetId', { targetId })
      .andWhere('r.targetType = :targetType', { targetType })
      .getRawOne<{ avg: string | null; count: string }>();
    return { avg: parseFloat(row?.avg ?? '0') || 0, count: parseInt(row?.count ?? '0', 10) || 0 };
  }
}
