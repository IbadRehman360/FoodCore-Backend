import { Body, Controller, Delete, Get, Param, Post, Query } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiQuery, ApiTags } from '@nestjs/swagger';
import { HealthLogsService } from '../services/health-logs.service';
import { LogWeightDto } from '../dto/log-weight.dto';
import { LogSymptomDto } from '../dto/log-symptom.dto';
import { CurrentUser } from '@common/decorators';

@ApiTags('Food Diary')
@ApiBearerAuth()
@Controller('food-diary')
export class HealthLogsController {
  constructor(private readonly healthLogs: HealthLogsService) {}

  // ─── Weight ──────────────────────────────────────────────────────────────
  @Post('weight')
  @ApiOperation({ summary: 'Log weight for a date (upserts — one log per day)' })
  logWeight(@CurrentUser('id') userId: string, @Body() dto: LogWeightDto) {
    return this.healthLogs.logWeight(userId, dto);
  }

  @Get('weight')
  @ApiOperation({ summary: 'Weight history (last N days)' })
  @ApiQuery({ name: 'days', required: false, example: 30 })
  getWeightHistory(@CurrentUser('id') userId: string, @Query('days') days = '30') {
    return this.healthLogs.getWeightHistory(userId, parseInt(days, 10) || 30);
  }

  @Delete('weight/:id')
  @ApiOperation({ summary: 'Delete a weight log entry' })
  deleteWeight(@CurrentUser('id') userId: string, @Param('id') id: string) {
    return this.healthLogs.deleteWeight(userId, id);
  }

  // ─── Symptoms ────────────────────────────────────────────────────────────
  @Post('symptoms')
  @ApiOperation({ summary: 'Log symptoms for a date (multiple entries per day allowed)' })
  logSymptom(@CurrentUser('id') userId: string, @Body() dto: LogSymptomDto) {
    return this.healthLogs.logSymptom(userId, dto);
  }

  @Get('symptoms')
  @ApiOperation({ summary: 'Symptom history (last N days)' })
  @ApiQuery({ name: 'days', required: false, example: 30 })
  getSymptomHistory(@CurrentUser('id') userId: string, @Query('days') days = '30') {
    return this.healthLogs.getSymptomHistory(userId, parseInt(days, 10) || 30);
  }

  @Delete('symptoms/:id')
  @ApiOperation({ summary: 'Delete a symptom log entry' })
  deleteSymptom(@CurrentUser('id') userId: string, @Param('id') id: string) {
    return this.healthLogs.deleteSymptom(userId, id);
  }
}
