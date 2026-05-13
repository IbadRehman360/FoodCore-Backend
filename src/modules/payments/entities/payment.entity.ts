import { Column, Entity } from 'typeorm';
import { BaseEntity } from '@database/postgres/base.entity';
import { PaymentStatus } from '@common/enums';

export enum PaymentType {
  SUBSCRIPTION = 'subscription',
  CONSULTATION = 'consultation',
}

@Entity('payments')
export class Payment extends BaseEntity {
  @Column() userId: string;
  @Column({ type: 'float' }) amount: number;
  @Column({ default: 'USD' }) currency: string;
  @Column({ type: 'enum', enum: PaymentStatus, default: PaymentStatus.PENDING }) status: PaymentStatus;
  @Column({ nullable: true }) stripePaymentIntentId: string;
  @Column({ type: 'enum', enum: PaymentType }) type: PaymentType;
  @Column({ nullable: true }) referenceId: string;
}
