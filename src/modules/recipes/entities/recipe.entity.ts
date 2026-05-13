import { Column, Entity } from 'typeorm';
import { BaseEntity } from '@database/postgres/base.entity';

@Entity('recipes')
export class Recipe extends BaseEntity {
  @Column() title: string;
  @Column('text', { array: true }) ingredients: string[];
  @Column('text') instructions: string;
  @Column({ type: 'jsonb', nullable: true }) nutritionInfo: Record<string, number>;
  @Column() authorId: string;
  @Column({ nullable: true }) category: string;
  @Column({ nullable: true }) imageUrl: string;
  @Column({ default: false }) isWatermarked: boolean;
  @Column({ default: 0 }) viewCount: number;
  @Column({ default: 0 }) downloadCount: number;
}
