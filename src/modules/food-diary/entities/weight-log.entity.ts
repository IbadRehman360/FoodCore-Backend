import { Column, Entity, Index, Unique } from 'typeorm';
import { BaseEntity } from '@database/postgres/base.entity';

@Entity('weight_logs')
@Index(['userId', 'date'])
@Unique('uq_weight_logs_user_date', ['userId', 'date'])
export class WeightLog extends BaseEntity {
  @Column() userId: string;
  @Column({ type: 'date' }) date: Date;
  @Column({ type: 'float' }) weight: number;
  @Column({ type: 'text', nullable: true }) notes: string;
}
