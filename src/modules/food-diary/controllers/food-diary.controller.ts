import { Body, Controller, Delete, Get, Param, Patch, Post, Query } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiQuery, ApiTags } from '@nestjs/swagger';
import { FoodDiaryService } from '../services/food-diary.service';
import { CreateFoodDiaryEntryDto } from '../dto/create-food-diary-entry.dto';
import { CurrentUser } from '@common/decorators';
import { PaginationDto } from '@common/dto';

@ApiTags('Food Diary')
@ApiBearerAuth()
@Controller('food-diary')
export class FoodDiaryController {
  constructor(private readonly foodDiaryService: FoodDiaryService) {}

  @Post()
  @ApiOperation({ summary: 'Log a food diary entry' })
  create(@CurrentUser('id') userId: string, @Body() dto: CreateFoodDiaryEntryDto) {
    return this.foodDiaryService.create(userId, dto);
  }

  @Get('by-date')
  @ApiOperation({ summary: 'Get diary entries for a specific date' })
  @ApiQuery({ name: 'date', example: '2026-05-11' })
  getByDate(@CurrentUser('id') userId: string, @Query('date') date: string) {
    return this.foodDiaryService.getByDate(userId, date);
  }

  @Get('history')
  @ApiOperation({ summary: 'Get paginated diary history' })
  getHistory(@CurrentUser('id') userId: string, @Query() pagination: PaginationDto) {
    return this.foodDiaryService.getHistory(userId, pagination);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get a diary entry by ID' })
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
  remove(@Param('id') id: string) {
    return this.foodDiaryService.remove(id);
  }
}
