import { Column, Entity } from 'typeorm';
import { BaseEntity } from '@database/postgres/base.entity';

export enum NotificationType {
  SYSTEM = 'system',
  APPOINTMENT = 'appointment',
  MEAL_PLAN = 'meal_plan',
  PROMOTION = 'promotion',
}

@Entity('notifications')
export class Notification extends BaseEntity {
  @Column() userId: string;
  @Column() title: string;
  @Column('text') body: string;
  @Column({ type: 'enum', enum: NotificationType, default: NotificationType.SYSTEM }) type: NotificationType;
  @Column({ default: false }) isRead: boolean;
  @Column({ type: 'jsonb', nullable: true }) data: Record<string, any>;
}
