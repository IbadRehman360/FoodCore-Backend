import { Column, Entity, JoinColumn, ManyToOne } from 'typeorm';
import { BaseEntity } from '@database/postgres/base.entity';
import { User } from '@modules/users/entities/user.entity';

@Entity('communities')
export class Community extends BaseEntity {
  @Column() name: string;
  @Column({ type: 'text', nullable: true }) description: string;
  @Column({ nullable: true }) imageUrl: string;

  @Column({ type: 'uuid' }) createdById: string;
  @ManyToOne(() => User)
  @JoinColumn({ name: 'createdById' })
  createdBy: User;
}
