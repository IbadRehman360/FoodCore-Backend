import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Community } from './entities/community.entity';
import { CommunityMember } from './entities/community-member.entity';
import { CommunityPost } from './entities/community-post.entity';
import { CommunitiesController } from './controllers/communities.controller';
import { CommunitiesService } from './services/communities.service';
import { CommunitiesRepository } from './repositories/communities.repository';
import { StorageModule } from '@modules/storage/storage.module';

@Module({
  imports: [TypeOrmModule.forFeature([Community, CommunityMember, CommunityPost]), StorageModule],
  controllers: [CommunitiesController],
  providers: [CommunitiesService, CommunitiesRepository],
  exports: [CommunitiesService],
})
export class CommunitiesModule {}
