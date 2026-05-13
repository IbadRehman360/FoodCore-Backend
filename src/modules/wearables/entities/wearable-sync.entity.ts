import { Column, Entity } from 'typeorm';
import { BaseEntity } from '@database/postgres/base.entity';

@Entity('wearable_syncs')
export class WearableSync extends BaseEntity {
  @Column() userId: string;
  @Column() provider: string;
  @Column({ type: 'timestamp', nullable: true }) lastSyncAt: Date;
  @Column({ type: 'json', nullable: true }) data: Record<string, any>;
}
