import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CopyrightAgreement } from './entities/copyright-agreement.entity';
import { CopyrightController } from './controllers/copyright.controller';
import { CopyrightService } from './services/copyright.service';
import { CopyrightRepository } from './repositories/copyright.repository';

@Module({
  imports: [TypeOrmModule.forFeature([CopyrightAgreement])],
  controllers: [CopyrightController],
  providers: [CopyrightService, CopyrightRepository],
  exports: [CopyrightService],
})
export class CopyrightModule {}
