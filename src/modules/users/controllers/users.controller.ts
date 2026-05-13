import { Body, Controller, Get, Param, Patch, Query } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { UsersService } from '../services/users.service';
import { UpdateProfileDto } from '../dto/update-profile.dto';
import { SetupProfileDto } from '../dto/setup-profile.dto';
import { HealthProfileDto } from '../dto/health-profile.dto';
import { CurrentUser, Roles } from '@common/decorators';
import { Role } from '@common/enums';
import { PaginationDto } from '@common/dto';

@ApiTags('Users')
@ApiBearerAuth()
@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Get('me')
  @ApiOperation({ summary: 'Get current user profile' })
  getProfile(@CurrentUser('id') userId: string) {
    return this.usersService.findOrFail(userId);
  }

  @Patch('me')
  @ApiOperation({ summary: 'Update general profile fields' })
  updateProfile(@CurrentUser('id') userId: string, @Body() dto: UpdateProfileDto) {
    return this.usersService.updateProfile(userId, dto);
  }

  @Patch('me/profile')
  @ApiOperation({ summary: 'Complete profile setup — screen 6 (country, city, state, about, phone, photo)' })
  setupProfile(@CurrentUser('id') userId: string, @Body() dto: SetupProfileDto) {
    return this.usersService.setupProfile(userId, dto);
  }

  @Patch('me/health')
  @ApiOperation({ summary: 'Save health profile — screen 7 (goals, weight, symptoms, allergies, meal preference)' })
  updateHealthProfile(@CurrentUser('id') userId: string, @Body() dto: HealthProfileDto) {
    return this.usersService.updateHealthProfile(userId, dto);
  }

  @Get('me/referral')
  @ApiOperation({ summary: 'Get referral code and shareable link — screen 8' })
  getReferral(@CurrentUser('id') userId: string) {
    return this.usersService.getReferral(userId);
  }

  @Get()
  @Roles(Role.ADMIN, Role.SUPER_ADMIN)
  @ApiOperation({ summary: '[Admin] List all users' })
  findAll(@Query() pagination: PaginationDto) {
    return this.usersService.findAll(pagination);
  }

  @Get(':id')
  @Roles(Role.ADMIN, Role.SUPER_ADMIN)
  @ApiOperation({ summary: '[Admin] Get user by ID' })
  findOne(@Param('id') id: string) {
    return this.usersService.findOrFail(id);
  }
}
