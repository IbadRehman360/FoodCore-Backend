import { Column, Entity, Index, OneToMany } from 'typeorm';
import { BaseEntity } from '@database/postgres/base.entity';
import { MealPlanItem } from './meal-plan-item.entity';

export enum MealPlanStatus {
  DRAFT = 'draft',
  PUBLISHED = 'published',
  ASSIGNED = 'assigned',
  COMPLETED = 'completed',
  CANCELLED = 'cancelled',
}

export enum MealPlanType {
  DAILY = 'daily',
  WEEKLY = 'weekly',
}

@Entity('meal_plans')
@Index(['userId', 'status'])
@Index(['dietitianId', 'status'])
export class MealPlan extends BaseEntity {
  @Column() title: string;
  @Column({ type: 'text', nullable: true }) description: string;

  @Column({ nullable: true }) dietitianId: string;
  @Column({ nullable: true }) userId: string;

  @Column({ type: 'enum', enum: MealPlanType, default: MealPlanType.WEEKLY })
  planType: MealPlanType;

  @Column({ type: 'enum', enum: MealPlanStatus, default: MealPlanStatus.DRAFT })
  status: MealPlanStatus;

  @Column({ type: 'date', nullable: true }) startDate: Date;
  @Column({ type: 'date', nullable: true }) endDate: Date;

  @Column({ default: false }) isTemplate: boolean;

  @Column({ type: 'timestamp', nullable: true }) publishedAt: Date;
  @Column({ type: 'timestamp', nullable: true }) assignedAt: Date;

  @OneToMany(() => MealPlanItem, (item) => item.plan, { cascade: true })
  items: MealPlanItem[];
}
