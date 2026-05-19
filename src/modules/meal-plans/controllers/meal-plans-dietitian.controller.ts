import { Body, Controller, Delete, Get, Param, Patch, Post, Query } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { MealPlansService } from '../services/meal-plans.service';
import { CreateMealPlanDto } from '../dto/create-meal-plan.dto';
import { CreateMealPlanItemDto } from '../dto/create-meal-plan-item.dto';
import { AssignMealPlanDto } from '../dto/assign-meal-plan.dto';
import { CurrentUser, Roles } from '@common/decorators';
import { Role } from '@common/enums';
import { PaginationDto } from '@common/dto';

@ApiTags('Meal Plans (Dietitian)')
@ApiBearerAuth()
@Roles(Role.DIETITIAN)
@Controller('meal-plans')
export class MealPlansDietitianController {
  constructor(private readonly mealPlansService: MealPlansService) {}

  @Post()
  @ApiOperation({ summary: 'Create a meal plan draft' })
  @ApiResponse({ status: 201, description: 'Draft created' })
  createDraft(@CurrentUser('id') dietitianId: string, @Body() dto: CreateMealPlanDto) {
    return this.mealPlansService.createDraft(dietitianId, dto);
  }

  @Get('mine')
  @ApiOperation({ summary: 'List all my meal plans (drafts, published, assigned, templates)' })
  listMine(@CurrentUser('id') dietitianId: string, @Query() pagination: PaginationDto) {
    return this.mealPlansService.listMine(dietitianId, pagination);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Edit draft meal plan (title, dates, type)' })
  updateDraft(
    @CurrentUser('id') dietitianId: string,
    @Param('id') id: string,
    @Body() dto: Partial<CreateMealPlanDto>,
  ) {
    return this.mealPlansService.updateDraft(dietitianId, id, dto);
  }

  @Post(':id/items')
  @ApiOperation({ summary: 'Add a meal item to a plan' })
  addItem(
    @CurrentUser('id') dietitianId: string,
    @Param('id') planId: string,
    @Body() dto: CreateMealPlanItemDto,
  ) {
    return this.mealPlansService.addItem(dietitianId, planId, dto);
  }

  @Delete(':id/items/:itemId')
  @ApiOperation({ summary: 'Remove a meal item from a plan' })
  removeItem(
    @CurrentUser('id') dietitianId: string,
    @Param('id') planId: string,
    @Param('itemId') itemId: string,
  ) {
    return this.mealPlansService.removeItem(dietitianId, planId, itemId);
  }

  @Patch(':id/publish')
  @ApiOperation({ summary: 'Publish a draft plan (required before assigning)' })
  publish(@CurrentUser('id') dietitianId: string, @Param('id') id: string) {
    return this.mealPlansService.publish(dietitianId, id);
  }

  @Post(':id/assign')
  @ApiOperation({ summary: 'Assign a published plan to a user' })
  assign(
    @CurrentUser('id') dietitianId: string,
    @Param('id') id: string,
    @Body() dto: AssignMealPlanDto,
  ) {
    return this.mealPlansService.assignToUser(dietitianId, id, dto);
  }

  @Patch(':id/cancel')
  @ApiOperation({ summary: 'Cancel an assigned plan' })
  cancel(@CurrentUser('id') dietitianId: string, @Param('id') id: string) {
    return this.mealPlansService.cancel(dietitianId, id);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete a draft / template plan (cannot delete assigned)' })
  remove(@CurrentUser('id') dietitianId: string, @Param('id') id: string) {
    return this.mealPlansService.remove(dietitianId, id);
  }
}
