import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { SocialLink } from './entities/social-link.entity';
import { SocialController } from './controllers/social.controller';
import { SocialService } from './services/social.service';
import { SocialRepository } from './repositories/social.repository';

@Module({
  imports: [TypeOrmModule.forFeature([SocialLink])],
  controllers: [SocialController],
  providers: [SocialService, SocialRepository],
  exports: [SocialService],
})
export class SocialModule {}
