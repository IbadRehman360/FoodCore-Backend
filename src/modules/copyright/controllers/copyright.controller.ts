import { Body, Controller, Get, HttpCode, HttpStatus, Post } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { CopyrightService } from '../services/copyright.service';
import { AcceptCopyrightDto } from '../dto/accept-copyright.dto';
import { CurrentUser } from '@common/decorators';

@ApiTags('Copyright')
@ApiBearerAuth()
@Controller('copyright')
export class CopyrightController {
  constructor(private readonly copyrightService: CopyrightService) {}

  @Post('accept')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Accept the copyright agreement' })
  accept(@CurrentUser('id') userId: string, @Body() dto: AcceptCopyrightDto) {
    return this.copyrightService.accept(userId, dto);
  }

  @Get('check')
  @ApiOperation({ summary: 'Check if user has accepted the copyright agreement' })
  check(@CurrentUser('id') userId: string) {
    return this.copyrightService.check(userId);
  }
}
