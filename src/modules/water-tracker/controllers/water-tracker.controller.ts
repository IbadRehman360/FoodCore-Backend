import { Body, Controller, Delete, Get, Param, Patch, Post, Query } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiQuery, ApiTags } from '@nestjs/swagger';
import { WaterTrackerService } from '../services/water-tracker.service';
import { LogWaterDto } from '../dto/log-water.dto';
import { SetWaterGoalDto } from '../dto/set-water-goal.dto';
import { SetWaterRemindersDto } from '../dto/set-water-reminders.dto';
import { CurrentUser } from '@common/decorators';

@ApiTags('Water Tracker')
@ApiBearerAuth()
@Controller('water-tracker')
export class WaterTrackerController {
  constructor(private readonly waterTracker: WaterTrackerService) {}

  // ─── Logging ─────────────────────────────────────────────────────────────
  @Post()
  @ApiOperation({ summary: 'Log a water intake entry (ml)' })
  log(@CurrentUser('id') userId: string, @Body() dto: LogWaterDto) {
    return this.waterTracker.log(userId, dto);
  }

  @Get('summary')
  @ApiOperation({ summary: 'Daily summary: goal, total, remaining, percent' })
  @ApiQuery({ name: 'date', example: '2026-05-19' })
  summary(@CurrentUser('id') userId: string, @Query('date') date: string) {
    return this.waterTracker.getDailySummary(userId, date);
  }

  @Get()
  @ApiOperation({ summary: 'List water log entries for a date' })
  @ApiQuery({ name: 'date', example: '2026-05-19' })
  getByDate(@CurrentUser('id') userId: string, @Query('date') date: string) {
    return this.waterTracker.getByDate(userId, date);
  }

  @Get('history')
  @ApiOperation({ summary: 'Daily water totals for the last N days (max 90)' })
  @ApiQuery({ name: 'days', required: false, example: 7 })
  history(@CurrentUser('id') userId: string, @Query('days') days = '7') {
    return this.waterTracker.getHistory(userId, parseInt(days, 10) || 7);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete a water log entry' })
  remove(@CurrentUser('id') userId: string, @Param('id') id: string) {
    return this.waterTracker.deleteLog(userId, id);
  }

  // ─── Goal ────────────────────────────────────────────────────────────────
  @Get('goal')
  @ApiOperation({ summary: 'Get current daily water goal (ml)' })
  getGoal(@CurrentUser('id') userId: string) {
    return this.waterTracker.getGoal(userId);
  }

  @Patch('goal')
  @ApiOperation({ summary: 'Set daily water goal (ml)' })
  setGoal(@CurrentUser('id') userId: string, @Body() dto: SetWaterGoalDto) {
    return this.waterTracker.setGoal(userId, dto);
  }

  // ─── Reminders ───────────────────────────────────────────────────────────
  @Get('reminders')
  @ApiOperation({ summary: 'Get water reminder schedule' })
  getReminders(@CurrentUser('id') userId: string) {
    return this.waterTracker.getReminders(userId);
  }

  @Patch('reminders')
  @ApiOperation({
    summary: 'Set water reminder schedule (delivery wired in FC-072 Notifications)',
  })
  setReminders(@CurrentUser('id') userId: string, @Body() dto: SetWaterRemindersDto) {
    return this.waterTracker.setReminders(userId, dto);
  }
}
