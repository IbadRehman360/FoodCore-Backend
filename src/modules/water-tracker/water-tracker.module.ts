import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { WaterLog } from './entities/water-log.entity';
import { WaterTrackerController } from './controllers/water-tracker.controller';
import { WaterTrackerService } from './services/water-tracker.service';
import { WaterTrackerRepository } from './repositories/water-tracker.repository';

@Module({
  imports: [TypeOrmModule.forFeature([WaterLog])],
  controllers: [WaterTrackerController],
  providers: [WaterTrackerService, WaterTrackerRepository],
  exports: [WaterTrackerService],
})
export class WaterTrackerModule {}
