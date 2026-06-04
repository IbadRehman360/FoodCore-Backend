import { Column, Entity, JoinColumn, ManyToOne } from 'typeorm';
import { BaseEntity } from '@database/postgres/base.entity';
import { User } from '@modules/users/entities/user.entity';

export enum PodcastStatus {
  LIVE = 'live',
  ENDED = 'ended',
}

@Entity('podcasts')
export class Podcast extends BaseEntity {
  @Column({ nullable: true }) title: string;
  @Column({ unique: true }) channelName: string;
  @Column({ nullable: true }) thumbnailUrl: string;

  @Column({ type: 'enum', enum: PodcastStatus, default: PodcastStatus.LIVE })
  status: PodcastStatus;

  @Column({ type: 'int', default: 0 }) viewerCount: number;

  @Column({ type: 'timestamp', nullable: true }) startedAt: Date;
  @Column({ type: 'timestamp', nullable: true }) endedAt: Date;

  @Column({ type: 'uuid' }) hostId: string;
  @ManyToOne(() => User)
  @JoinColumn({ name: 'hostId' })
  host: User;
}
