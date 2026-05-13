import { Column, Entity } from 'typeorm';
import { BaseEntity } from '@database/postgres/base.entity';
import { SubscriptionPlan } from '@common/enums';

@Entity('subscriptions')
export class Subscription extends BaseEntity {
  @Column() userId: string;
  @Column({ type: 'enum', enum: SubscriptionPlan, default: SubscriptionPlan.FREE }) plan: SubscriptionPlan;
  @Column({ type: 'date', nullable: true }) startDate: Date;
  @Column({ type: 'date', nullable: true }) endDate: Date;
  @Column({ default: false }) isActive: boolean;
  @Column({ nullable: true }) stripeSubscriptionId: string;
}
