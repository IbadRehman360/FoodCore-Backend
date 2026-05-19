import { Column, Entity, Index } from 'typeorm';
import { BaseEntity } from '@database/postgres/base.entity';

@Entity('symptom_logs')
@Index(['userId', 'date'])
export class SymptomLog extends BaseEntity {
  @Column() userId: string;
  @Column({ type: 'date' }) date: Date;
  @Column({ type: 'text', array: true, default: [] }) symptoms: string[];
  @Column({ type: 'int', default: 0 }) severity: number;
  @Column({ type: 'text', nullable: true }) notes: string;
}
