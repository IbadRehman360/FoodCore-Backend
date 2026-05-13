import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Payment } from '../entities/payment.entity';

@Injectable()
export class PaymentsRepository {
  constructor(@InjectRepository(Payment) private readonly repo: Repository<Payment>) {}

  findById(id: string) {
    return this.repo.findOne({ where: { id } });
  }

  findByUserId(userId: string, skip: number, take: number) {
    return this.repo.findAndCount({ where: { userId }, skip, take, order: { createdAt: 'DESC' } });
  }

  findByStripeId(stripePaymentIntentId: string) {
    return this.repo.findOne({ where: { stripePaymentIntentId } });
  }

  create(data: Partial<Payment>) {
    return this.repo.save(this.repo.create(data));
  }

  update(id: string, data: Partial<Payment>) {
    return this.repo.update(id, data);
  }
}
