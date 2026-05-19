import { Body, Controller, Delete, Get, Param, Patch, Post, Query } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiQuery, ApiTags } from '@nestjs/swagger';
import { FoodDiaryService } from '../services/food-diary.service';
import { CreateFoodDiaryEntryDto } from '../dto/create-food-diary-entry.dto';
import { CurrentUser } from '@common/decorators';

@ApiTags('Food Diary')
@ApiBearerAuth()
@Controller('food-diary')
export class FoodDiaryController {
  constructor(private readonly foodDiaryService: FoodDiaryService) {}

  @Post()
  @ApiOperation({ summary: 'Log a food entry (breakfast/lunch/dinner/snack)' })
  create(@CurrentUser('id') userId: string, @Body() dto: CreateFoodDiaryEntryDto) {
    return this.foodDiaryService.create(userId, dto);
  }

  @Get('summary')
  @ApiOperation({ summary: 'Daily summary: kcal goal, consumed, per-meal totals, macro+micro totals' })
  @ApiQuery({ name: 'date', example: '2026-05-19' })
  getDailySummary(@CurrentUser('id') userId: string, @Query('date') date: string) {
    return this.foodDiaryService.getDailySummary(userId, date);
  }

  @Get('weekly')
  @ApiOperation({ summary: 'Weekly budget progress — 7 days from weekStart' })
  @ApiQuery({ name: 'weekStart', example: '2026-05-18' })
  getWeekly(@CurrentUser('id') userId: string, @Query('weekStart') weekStart: string) {
    return this.foodDiaryService.getWeeklyBudget(userId, weekStart);
  }

  @Get()
  @ApiOperation({ summary: 'Get diary entries for a specific date' })
  @ApiQuery({ name: 'date', example: '2026-05-19' })
  getByDate(@CurrentUser('id') userId: string, @Query('date') date: string) {
    return this.foodDiaryService.getByDate(userId, date);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get a diary entry by id' })
  findOne(@Param('id') id: string) {
    return this.foodDiaryService.findOrFail(id);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Update a diary entry' })
  update(@Param('id') id: string, @Body() dto: Partial<CreateFoodDiaryEntryDto>) {
    return this.foodDiaryService.update(id, dto);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete a diary entry' })
  remove(@CurrentUser('id') userId: string, @Param('id') id: string) {
    return this.foodDiaryService.remove(userId, id);
  }
}
