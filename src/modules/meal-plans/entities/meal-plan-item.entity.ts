import { Column, Entity, Index, JoinColumn, ManyToOne } from 'typeorm';
import { BaseEntity } from '@database/postgres/base.entity';
import { MealType } from '@common/enums';
import { MealPlan } from './meal-plan.entity';

@Entity('meal_plan_items')
@Index(['planId', 'dayOffset'])
export class MealPlanItem extends BaseEntity {
  @Column() planId: string;

  @ManyToOne(() => MealPlan, (plan) => plan.items, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'planId' })
  plan: MealPlan;

  @Column({ type: 'int', default: 0 })
  dayOffset: number;

  @Column({ type: 'enum', enum: MealType }) mealType: MealType;

  @Column() foodName: string;
  @Column({ nullable: true }) foodId: string;
  @Column({ type: 'float', default: 1 }) quantity: number;
  @Column({ nullable: true }) servingUnit: string;

  @Column({ type: 'float', default: 0 }) calories: number;
  @Column({ type: 'float', default: 0 }) protein: number;
  @Column({ type: 'float', default: 0 }) carbs: number;
  @Column({ type: 'float', default: 0 }) fat: number;

  @Column({ type: 'text', nullable: true }) notes: string;
}
