import { Body, Controller, Get, Param, Patch, Query } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { UsersService } from '@modules/users/services/users.service';
import { Roles } from '@common/decorators';
import { Role, AccountStatus } from '@common/enums';
import { PaginationDto } from '@common/dto';
import { IsEnum } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

class UpdateUserStatusDto {
  @ApiProperty({ enum: AccountStatus }) @IsEnum(AccountStatus) status: AccountStatus;
}

@ApiTags('Admin - Users')
@ApiBearerAuth()
@Roles(Role.ADMIN, Role.SUPER_ADMIN)
@Controller('admin/users')
export class AdminUsersController {
  constructor(private readonly usersService: UsersService) {}

  @Get()
  @ApiOperation({ summary: '[Admin] List all users with pagination' })
  findAll(@Query() pagination: PaginationDto) {
    return this.usersService.findAll(pagination);
  }

  @Get(':id')
  @ApiOperation({ summary: '[Admin] Get user by ID' })
  findOne(@Param('id') id: string) {
    return this.usersService.findOrFail(id);
  }

  @Patch(':id/status')
  @ApiOperation({ summary: '[Admin] Update user account status' })
  updateStatus(@Param('id') id: string, @Body() dto: UpdateUserStatusDto) {
    return this.usersService.updateProfile(id, dto as any);
  }
}
