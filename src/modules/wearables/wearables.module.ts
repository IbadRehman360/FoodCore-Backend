import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { WearableSync } from './entities/wearable-sync.entity';
import { WearablesController } from './controllers/wearables.controller';
import { WearablesService } from './services/wearables.service';
import { WearablesRepository } from './repositories/wearables.repository';

@Module({
  imports: [TypeOrmModule.forFeature([WearableSync])],
  controllers: [WearablesController],
  providers: [WearablesService, WearablesRepository],
  exports: [WearablesService],
})
export class WearablesModule {}
