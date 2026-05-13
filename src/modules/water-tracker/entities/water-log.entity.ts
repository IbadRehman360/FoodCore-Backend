import { Column, Entity } from 'typeorm';
import { BaseEntity } from '@database/postgres/base.entity';

@Entity('water_logs')
export class WaterLog extends BaseEntity {
  @Column() userId: string;
  @Column({ type: 'int' }) amount: number;
  @Column({ type: 'date' }) date: Date;
  @Column({ type: 'int', default: 2000 }) goal: number;
}
