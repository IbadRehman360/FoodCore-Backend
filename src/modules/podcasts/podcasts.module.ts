import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Podcast } from './entities/podcast.entity';
import { PodcastsController } from './controllers/podcasts.controller';
import { PodcastsService } from './services/podcasts.service';
import { PodcastsRepository } from './repositories/podcasts.repository';

@Module({
  imports: [TypeOrmModule.forFeature([Podcast])],
  controllers: [PodcastsController],
  providers: [PodcastsService, PodcastsRepository],
  exports: [PodcastsService],
})
export class PodcastsModule {}
