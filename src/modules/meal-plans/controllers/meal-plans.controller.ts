import { Controller, Get, Param, Query } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { MealPlansService } from '../services/meal-plans.service';
import { CurrentUser } from '@common/decorators';
import { PaginationDto } from '@common/dto';

@ApiTags('Meal Plans (User)')
@ApiBearerAuth()
@Controller('meal-plans')
export class MealPlansController {
  constructor(private readonly mealPlansService: MealPlansService) {}

  @Get('me')
  @ApiOperation({ summary: 'List all meal plans assigned to me' })
  listMine(@CurrentUser('id') userId: string, @Query() pagination: PaginationDto) {
    return this.mealPlansService.listAssignedToUser(userId, pagination);
  }

  @Get('me/active')
  @ApiOperation({ summary: 'Get my currently-active meal plan (if any)' })
  active(@CurrentUser('id') userId: string) {
    return this.mealPlansService.getActivePlanForUser(userId);
  }

  @Get('me/today')
  @ApiOperation({ summary: 'Get today\'s meals from active plan' })
  today(@CurrentUser('id') userId: string) {
    return this.mealPlansService.getTodayForUser(userId);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get a meal plan by id (owner or assignee only)' })
  findOne(@CurrentUser('id') viewerId: string, @Param('id') id: string) {
    return this.mealPlansService.getById(viewerId, id);
  }
}
