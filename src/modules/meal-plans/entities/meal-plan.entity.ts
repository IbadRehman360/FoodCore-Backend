import { Column, Entity } from 'typeorm';
import { BaseEntity } from '@database/postgres/base.entity';

export enum MealPlanStatus {
  ACTIVE = 'active',
  COMPLETED = 'completed',
  CANCELLED = 'cancelled',
}

@Entity('meal_plans')
export class MealPlan extends BaseEntity {
  @Column() title: string;
  @Column({ nullable: true }) description: string;
  @Column() userId: string;
  @Column({ nullable: true }) dietitianId: string;
  @Column({ type: 'date' }) startDate: Date;
  @Column({ type: 'date' }) endDate: Date;
  @Column({ type: 'enum', enum: MealPlanStatus, default: MealPlanStatus.ACTIVE }) status: MealPlanStatus;
}
