import { Column, Entity, JoinColumn, ManyToOne } from 'typeorm';
import { BaseEntity } from '@database/postgres/base.entity';
import { User } from '@modules/users/entities/user.entity';

export enum ReviewTargetType {
  DIETITIAN = 'dietitian',
  RECIPE = 'recipe',
}

@Entity('reviews')
export class Review extends BaseEntity {
  @Column() reviewerId: string;

  @ManyToOne(() => User)
  @JoinColumn({ name: 'reviewerId' })
  reviewer: User;

  @Column() targetId: string;
  @Column({ type: 'enum', enum: ReviewTargetType }) targetType: ReviewTargetType;
  @Column({ type: 'int' }) rating: number;
  @Column({ nullable: true }) comment: string;
}
