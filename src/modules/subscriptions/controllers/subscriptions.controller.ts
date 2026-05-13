import { Body, Controller, Get, Patch, Post } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { SubscriptionsService } from '../services/subscriptions.service';
import { UpgradeSubscriptionDto } from '../dto/upgrade-subscription.dto';
import { CurrentUser } from '@common/decorators';

@ApiTags('Subscriptions')
@ApiBearerAuth()
@Controller('subscriptions')
export class SubscriptionsController {
  constructor(private readonly subscriptionsService: SubscriptionsService) {}

  @Get('plan')
  @ApiOperation({ summary: 'Get my current subscription plan' })
  getCurrentPlan(@CurrentUser('id') userId: string) {
    return this.subscriptionsService.getCurrentPlan(userId);
  }

  @Post('upgrade')
  @ApiOperation({ summary: 'Upgrade subscription plan' })
  upgrade(@CurrentUser('id') userId: string, @Body() dto: UpgradeSubscriptionDto) {
    return this.subscriptionsService.upgrade(userId, dto);
  }

  @Patch('cancel')
  @ApiOperation({ summary: 'Cancel current subscription' })
  cancel(@CurrentUser('id') userId: string) {
    return this.subscriptionsService.cancel(userId);
  }
}
