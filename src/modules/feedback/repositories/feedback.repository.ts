import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Feedback } from '../entities/feedback.entity';

@Injectable()
export class FeedbackRepository {
  constructor(@InjectRepository(Feedback) private readonly repo: Repository<Feedback>) {}

  create(data: Partial<Feedback>) {
    return this.repo.save(this.repo.create(data));
  }

  findByUser(userId: string, skip: number, take: number) {
    return this.repo.findAndCount({
      where: { userId },
      skip,
      take,
      order: { createdAt: 'DESC' },
    });
  }
}
