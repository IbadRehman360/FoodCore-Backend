import { Column, Entity } from 'typeorm';
import { BaseEntity } from '@database/postgres/base.entity';

@Entity('social_links')
export class SocialLink extends BaseEntity {
  @Column() userId: string;
  @Column() platform: string;
  @Column() profileUrl: string;
}
