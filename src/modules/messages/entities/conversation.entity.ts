import { Column, Entity, Index } from 'typeorm';
import { BaseEntity } from '@database/postgres/base.entity';

/// A 1:1 conversation between two users. participantA/B are stored sorted so a
/// pair maps to exactly one conversation.
@Entity('conversations')
@Index(['participantA', 'participantB'], { unique: true })
export class Conversation extends BaseEntity {
  @Column({ type: 'uuid' }) participantA: string;
  @Column({ type: 'uuid' }) participantB: string;
  @Column({ type: 'text', nullable: true }) lastMessage: string;
  @Column({ type: 'timestamp', nullable: true }) lastMessageAt: Date;
}
