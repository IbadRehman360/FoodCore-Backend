import { Body, Controller, Delete, Get, Param, Patch, Post, Query } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { MealPlansService } from '../services/meal-plans.service';
import { CreateMealPlanDto } from '../dto/create-meal-plan.dto';
import { CurrentUser } from '@common/decorators';
import { PaginationDto } from '@common/dto';

@ApiTags('Meal Plans')
@ApiBearerAuth()
@Controller('meal-plans')
export class MealPlansController {
  constructor(private readonly mealPlansService: MealPlansService) {}

  @Post()
  @ApiOperation({ summary: 'Create a meal plan' })
  create(@CurrentUser('id') userId: string, @Body() dto: CreateMealPlanDto) {
    return this.mealPlansService.create(userId, dto);
  }

  @Get()
  @ApiOperation({ summary: 'Get my meal plans' })
  findAll(@CurrentUser('id') userId: string, @Query() pagination: PaginationDto) {
    return this.mealPlansService.findAll(userId, pagination);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get meal plan by ID' })
  findOne(@Param('id') id: string) {
    return this.mealPlansService.findOrFail(id);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Update a meal plan' })
  update(@Param('id') id: string, @Body() dto: Partial<CreateMealPlanDto>) {
    return this.mealPlansService.update(id, dto);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete a meal plan' })
  remove(@Param('id') id: string) {
    return this.mealPlansService.remove(id);
  }
}
