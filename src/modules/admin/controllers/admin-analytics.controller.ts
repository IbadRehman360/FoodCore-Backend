import { Controller, Get } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { UsersService } from '@modules/users/services/users.service';
import { DietitiansService } from '@modules/dietitians/services/dietitians.service';
import { Roles } from '@common/decorators';
import { Role } from '@common/enums';

@ApiTags('Admin - Analytics')
@ApiBearerAuth()
@Roles(Role.ADMIN, Role.SUPER_ADMIN)
@Controller('admin/analytics')
export class AdminAnalyticsController {
  constructor(
    private readonly usersService: UsersService,
    private readonly dietitiansService: DietitiansService,
  ) {}

  @Get('overview')
  @ApiOperation({ summary: '[Admin] Get platform overview stats' })
  async getOverview() {
    // TODO: aggregate real counts from services/repositories
    return {
      totalUsers: 0,
      totalDietitians: 0,
      pendingDietitians: 0,
      activeSubscriptions: 0,
      totalRevenue: 0,
    };
  }

  @Get('users/growth')
  @ApiOperation({ summary: '[Admin] Get user growth over time' })
  getUserGrowth() {
    // TODO: return time-series user registration data
    return { data: [] };
  }

  @Get('revenue')
  @ApiOperation({ summary: '[Admin] Get revenue analytics' })
  getRevenue() {
    // TODO: return revenue breakdown by period and type
    return { data: [] };
  }
}
