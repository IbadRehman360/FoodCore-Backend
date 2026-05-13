import { Column, Entity } from 'typeorm';
import { BaseEntity } from '@database/postgres/base.entity';

export enum ReviewTargetType {
  DIETITIAN = 'dietitian',
  RECIPE = 'recipe',
}

@Entity('reviews')
export class Review extends BaseEntity {
  @Column() reviewerId: string;
  @Column() targetId: string;
  @Column({ type: 'enum', enum: ReviewTargetType }) targetType: ReviewTargetType;
  @Column({ type: 'int' }) rating: number;
  @Column({ nullable: true }) comment: string;
}
