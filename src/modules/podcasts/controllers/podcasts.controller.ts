import {
  Body, Controller, Delete, Get, HttpCode, HttpStatus, Param, Post, Query,
} from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiQuery, ApiTags } from '@nestjs/swagger';
import { PodcastsService } from '../services/podcasts.service';
import { CreatePodcastDto } from '../dto/create-podcast.dto';
import { CurrentUser, Roles } from '@common/decorators';
import { Role } from '@common/enums';
import { PaginationDto } from '@common/dto';

@ApiTags('Podcasts')
@ApiBearerAuth()
@Controller('podcasts')
export class PodcastsController {
  constructor(private readonly service: PodcastsService) {}

  @Post()
  @Roles(Role.DIETITIAN)
  @ApiOperation({ summary: 'Go live — start a new podcast (consultants only)' })
  goLive(@CurrentUser('id') userId: string, @Body() dto: CreatePodcastDto) {
    return this.service.goLive(userId, dto);
  }

  @Get('config')
  @ApiOperation({ summary: 'Agora client config (public App ID)' })
  getConfig() {
    return this.service.getConfig();
  }

  @Get('live')
  @ApiOperation({ summary: 'List currently-live podcasts (optional ?search=)' })
  listLive(@Query() pagination: PaginationDto, @Query('search') search?: string) {
    return this.service.listLive(pagination, search);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get podcast details' })
  findOne(@Param('id') id: string) {
    return this.service.findOne(id);
  }

  @Get(':id/token')
  @ApiQuery({ name: 'role', enum: ['host', 'audience'], required: false })
  @ApiOperation({ summary: 'Get an Agora RTC token for this podcast channel' })
  getToken(@Param('id') id: string, @CurrentUser('id') userId: string, @Query('role') role?: string) {
    return this.service.getToken(id, userId, role === 'host' ? 'host' : 'audience');
  }

  @Post(':id/join')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Join a live podcast (increments viewer count)' })
  join(@Param('id') id: string, @CurrentUser('id') userId: string) {
    return this.service.join(id, userId);
  }

  @Post(':id/leave')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Leave a live podcast (decrements viewer count)' })
  leave(@Param('id') id: string, @CurrentUser('id') userId: string) {
    return this.service.leave(id, userId);
  }

  @Delete(':id')
  @Roles(Role.DIETITIAN)
  @ApiOperation({ summary: 'End a podcast (host only)' })
  end(@Param('id') id: string, @CurrentUser('id') userId: string) {
    return this.service.end(id, userId);
  }
}
