import { Column, Entity, JoinColumn, ManyToOne } from 'typeorm';
import { BaseEntity } from '@database/postgres/base.entity';
import { Community } from './community.entity';
import { User } from '@modules/users/entities/user.entity';

@Entity('community_posts')
export class CommunityPost extends BaseEntity {
  @Column({ type: 'uuid' }) communityId: string;
  @ManyToOne(() => Community)
  @JoinColumn({ name: 'communityId' })
  community: Community;

  @Column({ type: 'uuid' }) authorId: string;
  @ManyToOne(() => User)
  @JoinColumn({ name: 'authorId' })
  author: User;

  @Column({ type: 'text' }) content: string;

  @Column({ type: 'uuid', nullable: true }) parentPostId: string | null;
}
