import { Column, Entity } from 'typeorm';
import { BaseEntity } from '@database/postgres/base.entity';
import { AppointmentStatus, ConsultationType } from '@common/enums';

@Entity('consultations')
export class Consultation extends BaseEntity {
  @Column() userId: string;
  @Column() dietitianId: string;
  @Column({ type: 'enum', enum: ConsultationType }) type: ConsultationType;
  @Column({ type: 'enum', enum: AppointmentStatus, default: AppointmentStatus.PENDING }) status: AppointmentStatus;
  @Column({ type: 'timestamp' }) scheduledAt: Date;
  @Column({ type: 'int', nullable: true }) duration: number;
  @Column({ nullable: true }) notes: string;
  @Column({ nullable: true }) meetingUrl: string;
}
