import { Column, Entity, Index } from 'typeorm';
import { BaseEntity } from '@database/postgres/base.entity';

@Entity('water_logs')
@Index(['userId', 'date'])
export class WaterLog extends BaseEntity {
  @Column() userId: string;
  @Column({ type: 'date' }) date: Date;
  @Column({ type: 'int' }) amount: number;
  @Column({ nullable: true }) source: string;
}
