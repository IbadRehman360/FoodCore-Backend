import { Column, Entity, Index, JoinColumn, ManyToOne } from 'typeorm';
import { BaseEntity } from '@database/postgres/base.entity';
import { Community } from './community.entity';
import { User } from '@modules/users/entities/user.entity';

@Entity('community_members')
@Index(['communityId', 'userId'], { unique: true })
export class CommunityMember extends BaseEntity {
  @Column({ type: 'uuid' }) communityId: string;
  @ManyToOne(() => Community)
  @JoinColumn({ name: 'communityId' })
  community: Community;

  @Column({ type: 'uuid' }) userId: string;
  @ManyToOne(() => User)
  @JoinColumn({ name: 'userId' })
  user: User;
}
