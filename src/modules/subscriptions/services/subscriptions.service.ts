import { Injectable, NotFoundException } from '@nestjs/common';
import { SubscriptionsRepository } from '../repositories/subscriptions.repository';
import { UpgradeSubscriptionDto } from '../dto/upgrade-subscription.dto';
import { SubscriptionPlan } from '@common/enums';
import { ERROR_MESSAGES } from '@common/constants';

@Injectable()
export class SubscriptionsService {
  constructor(private readonly subscriptionsRepo: SubscriptionsRepository) {}

  async getCurrentPlan(userId: string) {
    const sub = await this.subscriptionsRepo.findByUserId(userId);
    if (!sub) {
      return { plan: SubscriptionPlan.FREE, isActive: false };
    }
    return sub;
  }

  async upgrade(userId: string, dto: UpgradeSubscriptionDto) {
    const existing = await this.subscriptionsRepo.findByUserId(userId);
    if (existing) {
      await this.subscriptionsRepo.update(existing.id, { plan: dto.plan });
      return this.subscriptionsRepo.findById(existing.id);
    }
    return this.subscriptionsRepo.create({
      userId,
      plan: dto.plan,
      isActive: true,
      startDate: new Date(),
    });
  }

  async cancel(userId: string) {
    const sub = await this.subscriptionsRepo.findByUserId(userId);
    if (!sub) throw new NotFoundException(ERROR_MESSAGES.SUBSCRIPTION.NOT_FOUND);
    await this.subscriptionsRepo.update(sub.id, { isActive: false });
    return { message: 'Subscription cancelled.' };
  }
}
