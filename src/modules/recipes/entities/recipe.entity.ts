import { Column, Entity, JoinColumn, ManyToOne } from 'typeorm';
import { BaseEntity } from '@database/postgres/base.entity';
import { User } from '@modules/users/entities/user.entity';

@Entity('recipes')
export class Recipe extends BaseEntity {
  @Column() title: string;
  @Column('text', { nullable: true }) description: string;
  @Column('text', { array: true }) ingredients: string[];
  @Column('text', { nullable: true }) instructions: string;
  @Column({ type: 'jsonb', nullable: true }) nutritionInfo: Record<string, number>;
  @Column() authorId: string;

  @ManyToOne(() => User)
  @JoinColumn({ name: 'authorId' })
  author: User;

  @Column({ nullable: true }) category: string;
  @Column({ nullable: true }) imageUrl: string;
  @Column({ default: 'draft' }) status: string;
  @Column({ nullable: true }) servings: number;
  @Column({ default: false }) isWatermarked: boolean;
  @Column({ default: 0 }) viewCount: number;
  @Column({ default: 0 }) downloadCount: number;
  @Column({ type: 'float', default: 0 }) rating: number;
  @Column({ default: 0 }) reviewCount: number;
}
