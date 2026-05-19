import { Column, Entity, Index } from 'typeorm';
import { BaseEntity } from '@database/postgres/base.entity';
import { MealType } from '@common/enums';

@Entity('food_diary_entries')
@Index(['userId', 'date'])
export class FoodDiaryEntry extends BaseEntity {
  @Column() userId: string;
  @Column({ type: 'enum', enum: MealType }) mealType: MealType;
  @Column({ type: 'date' }) date: Date;

  @Column({ nullable: true }) foodId: string;
  @Column() foodName: string;
  @Column({ type: 'float', default: 1 }) quantity: number;
  @Column({ nullable: true }) servingUnit: string;

  @Column({ type: 'float', default: 0 }) calories: number;

  @Column({ type: 'float', default: 0 }) fat: number;
  @Column({ type: 'float', default: 0 }) saturatedFat: number;
  @Column({ type: 'float', default: 0 }) transFat: number;
  @Column({ type: 'float', default: 0 }) protein: number;
  @Column({ type: 'float', default: 0 }) carbs: number;
  @Column({ type: 'float', default: 0 }) fiber: number;
  @Column({ type: 'float', default: 0 }) sugar: number;
  @Column({ type: 'float', default: 0 }) addedSugar: number;
  @Column({ type: 'float', default: 0 }) cholesterol: number;
  @Column({ type: 'float', default: 0 }) sodium: number;

  @Column({ type: 'float', default: 0 }) vitA: number;
  @Column({ type: 'float', default: 0 }) vitC: number;
  @Column({ type: 'float', default: 0 }) vitD: number;
  @Column({ type: 'float', default: 0 }) vitB1: number;
  @Column({ type: 'float', default: 0 }) vitB2: number;
  @Column({ type: 'float', default: 0 }) vitB3: number;
  @Column({ type: 'float', default: 0 }) vitB6: number;
  @Column({ type: 'float', default: 0 }) vitB12: number;
  @Column({ type: 'float', default: 0 }) vitE: number;
  @Column({ type: 'float', default: 0 }) vitK: number;
  @Column({ type: 'float', default: 0 }) calcium: number;
  @Column({ type: 'float', default: 0 }) phosphorus: number;
  @Column({ type: 'float', default: 0 }) iron: number;
  @Column({ type: 'float', default: 0 }) potassium: number;
  @Column({ type: 'float', default: 0 }) magnesium: number;
  @Column({ type: 'float', default: 0 }) zinc: number;
}
