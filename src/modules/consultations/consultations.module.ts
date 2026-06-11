import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Consultation } from './entities/consultation.entity';
import { ConsultationsController } from './controllers/consultations.controller';
import { ConsultationsService } from './services/consultations.service';
import { ConsultationsRepository } from './repositories/consultations.repository';
import { UsersModule } from '@modules/users/users.module';

@Module({
  imports: [TypeOrmModule.forFeature([Consultation]), UsersModule],
  controllers: [ConsultationsController],
  providers: [ConsultationsService, ConsultationsRepository],
  exports: [ConsultationsService],
})
export class ConsultationsModule {}
