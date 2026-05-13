import { Body, Controller, Get, HttpCode, HttpStatus, Param, Post } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { WearablesService } from '../services/wearables.service';
import { ConnectWearableDto } from '../dto/connect-wearable.dto';
import { CurrentUser } from '@common/decorators';

@ApiTags('Wearables')
@ApiBearerAuth()
@Controller('wearables')
export class WearablesController {
  constructor(private readonly wearablesService: WearablesService) {}

  @Post('connect')
  @ApiOperation({ summary: 'Connect a wearable device' })
  connect(@CurrentUser('id') userId: string, @Body() dto: ConnectWearableDto) {
    return this.wearablesService.connect(userId, dto);
  }

  @Get()
  @ApiOperation({ summary: 'Get connected wearable devices' })
  getConnected(@CurrentUser('id') userId: string) {
    return this.wearablesService.getConnected(userId);
  }

  @Post(':provider/sync')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Trigger sync for a wearable provider' })
  sync(@CurrentUser('id') userId: string, @Param('provider') provider: string) {
    return this.wearablesService.sync(userId, provider);
  }
}
