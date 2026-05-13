import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { MulterModule } from '@nestjs/platform-express';
import { Dietitian } from './entities/dietitian.entity';
import { DietitiansController } from './controllers/dietitians.controller';
import { DietitiansService } from './services/dietitians.service';
import { DietitiansRepository } from './repositories/dietitians.repository';
import { UsersModule } from '@modules/users/users.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([Dietitian]),
    MulterModule.register({ dest: './uploads/certificates' }),
    UsersModule,
  ],
  controllers: [DietitiansController],
  providers: [DietitiansService, DietitiansRepository],
  exports: [DietitiansService],
})
export class DietitiansModule {}
