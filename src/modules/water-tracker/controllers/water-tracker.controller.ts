import { Body, Controller, Delete, Get, Param, Post, Query } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiQuery, ApiTags } from '@nestjs/swagger';
import { WaterTrackerService } from '../services/water-tracker.service';
import { LogWaterDto } from '../dto/log-water.dto';
import { CurrentUser } from '@common/decorators';
import { PaginationDto } from '@common/dto';

@ApiTags('Water Tracker')
@ApiBearerAuth()
@Controller('water-tracker')
export class WaterTrackerController {
  constructor(private readonly waterTrackerService: WaterTrackerService) {}

  @Post()
  @ApiOperation({ summary: 'Log water intake' })
  log(@CurrentUser('id') userId: string, @Body() dto: LogWaterDto) {
    return this.waterTrackerService.log(userId, dto);
  }

  @Get('by-date')
  @ApiOperation({ summary: 'Get water logs for a specific date' })
  @ApiQuery({ name: 'date', example: '2026-05-11' })
  getByDate(@CurrentUser('id') userId: string, @Query('date') date: string) {
    return this.waterTrackerService.getByDate(userId, date);
  }

  @Get('history')
  @ApiOperation({ summary: 'Get paginated water log history' })
  getHistory(@CurrentUser('id') userId: string, @Query() pagination: PaginationDto) {
    return this.waterTrackerService.getHistory(userId, pagination);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete a water log entry' })
  remove(@Param('id') id: string) {
    return this.waterTrackerService.remove(id);
  }
}
