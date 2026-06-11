import { Column, Entity, Index } from 'typeorm';
import { BaseEntity } from '@database/postgres/base.entity';

@Entity('messages')
export class Message extends BaseEntity {
  @Index()
  @Column({ type: 'uuid' }) conversationId: string;

  @Column({ type: 'uuid' }) senderId: string;

  @Column({ type: 'text' }) content: string;
}
