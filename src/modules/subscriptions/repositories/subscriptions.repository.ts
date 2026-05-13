import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Subscription } from '../entities/subscription.entity';

@Injectable()
export class SubscriptionsRepository {
  constructor(@InjectRepository(Subscription) private readonly repo: Repository<Subscription>) {}

  findByUserId(userId: string) {
    return this.repo.findOne({ where: { userId, isActive: true } });
  }

  findById(id: string) {
    return this.repo.findOne({ where: { id } });
  }

  create(data: Partial<Subscription>) {
    return this.repo.save(this.repo.create(data));
  }

  update(id: string, data: Partial<Subscription>) {
    return this.repo.update(id, data);
  }
}
