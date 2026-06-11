import { Column, Entity } from 'typeorm';
import { BaseEntity } from '@database/postgres/base.entity';

@Entity('feedback')
export class Feedback extends BaseEntity {
  @Column() userId: string;
  @Column() subject: string;
  @Column('text') message: string;
  @Column({ default: 'open' }) status: string;
}
