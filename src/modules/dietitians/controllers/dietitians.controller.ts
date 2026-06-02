import { Controller, Get, Param, Post, Query } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { DietitiansService } from '../services/dietitians.service';
import { CurrentUser } from '@common/decorators';
import { PaginationDto } from '@common/dto';

@ApiTags('Dietitians')
@Controller('dietitians')
export class DietitiansController {
  constructor(private readonly dietitiansService: DietitiansService) {}

  @Post('register')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Register as a dietitian — creates profile, sets role to DIETITIAN' })
  @ApiResponse({ status: 201, description: 'Dietitian profile created; status: pending approval' })
  @ApiResponse({ status: 400, description: 'Already registered as a dietitian' })
  register(@CurrentUser('id') userId: string) {
    return this.dietitiansService.register(userId);
  }

  @Get()
  @ApiOperation({ summary: 'Browse approved dietitians — optional ?search, ?specialty, ?location, ?minRating' })
  @ApiResponse({ status: 200, description: 'Paginated list of verified dietitians' })
  findAll(
    @Query() pagination: PaginationDto,
    @Query('search') search?: string,
    @Query('specialty') specialty?: string,
    @Query('location') location?: string,
    @Query('minRating') minRating?: string,
  ) {
    return this.dietitiansService.findApproved(pagination, {
      search,
      specialty,
      location,
      minRating: minRating ? parseFloat(minRating) : undefined,
    });
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get dietitian public profile by ID' })
  @ApiResponse({ status: 200, description: 'Dietitian profile' })
  @ApiResponse({ status: 404, description: 'Not found' })
  findOne(@Param('id') id: string) {
    return this.dietitiansService.findOrFail(id);
  }
}
