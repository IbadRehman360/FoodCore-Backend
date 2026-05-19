import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Dietitian } from './entities/dietitian.entity';
import { ConsultantProfileController } from './controllers/consultant-profile.controller';
import { DietitiansController } from './controllers/dietitians.controller';
import { DietitiansService } from './services/dietitians.service';
import { DietitiansRepository } from './repositories/dietitians.repository';
import { UsersModule } from '@modules/users/users.module';
import { StorageModule } from '@modules/storage/storage.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([Dietitian]),
    UsersModule,
    StorageModule,
  ],
  controllers: [ConsultantProfileController, DietitiansController],
  providers: [DietitiansService, DietitiansRepository],
  exports: [DietitiansService],
})
export class DietitiansModule {}
