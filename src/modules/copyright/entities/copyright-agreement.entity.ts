import { Column, Entity } from 'typeorm';
import { BaseEntity } from '@database/postgres/base.entity';

@Entity('copyright_agreements')
export class CopyrightAgreement extends BaseEntity {
  @Column() userId: string;
  @Column({ type: 'timestamp' }) acceptedAt: Date;
  @Column() version: string;
}
