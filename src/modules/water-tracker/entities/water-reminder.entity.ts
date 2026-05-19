import { Column, Entity, Unique } from 'typeorm';
import { BaseEntity } from '@database/postgres/base.entity';

@Entity('water_reminders')
@Unique('uq_water_reminders_user', ['userId'])
export class WaterReminder extends BaseEntity {
  @Column() userId: string;
  @Column({ default: false }) enabled: boolean;

  @Column({ type: 'text', array: true, default: [] })
  times: string[];

  @Column({ type: 'int', default: 60 })
  intervalMinutes: number;

  @Column({ default: 'Africa/Casablanca' })
  timezone: string;
}
