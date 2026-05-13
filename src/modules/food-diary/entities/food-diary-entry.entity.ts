import { Column, Entity } from 'typeorm';
import { BaseEntity } from '@database/postgres/base.entity';
import { MealType } from '@common/enums';

@Entity('food_diary_entries')
export class FoodDiaryEntry extends BaseEntity {
  @Column() userId: string;
  @Column({ type: 'enum', enum: MealType }) mealType: MealType;
  @Column() foodName: string;
  @Column({ type: 'float' }) calories: number;
  @Column({ type: 'date' }) date: Date;
  @Column({ type: 'float', nullable: true }) protein: number;
  @Column({ type: 'float', nullable: true }) carbs: number;
  @Column({ type: 'float', nullable: true }) fat: number;
}
