import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule } from '@nestjs/config';
import { User } from './entities/user.entity';
import { UserProfileController } from './controllers/user-profile.controller';
import { UsersService } from './services/users.service';
import { UsersRepository } from './repositories/users.repository';
import { StorageModule } from '@modules/storage/storage.module';

@Module({
  imports: [TypeOrmModule.forFeature([User]), ConfigModule, StorageModule],
  controllers: [UserProfileController],
  providers: [UsersService, UsersRepository],
  exports: [UsersService],
})
export class UsersModule {}
