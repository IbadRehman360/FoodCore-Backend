import { Body, Controller, Get, Param, Patch, Query } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { DietitiansService } from '@modules/dietitians/services/dietitians.service';
import { Roles } from '@common/decorators';
import { Role } from '@common/enums';
import { PaginationDto } from '@common/dto';
import { IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

class RejectDietitianDto {
  @ApiProperty() @IsString() reason: string;
}

@ApiTags('Admin - Dietitians')
@ApiBearerAuth()
@Roles(Role.ADMIN, Role.SUPER_ADMIN)
@Controller('admin/dietitians')
export class AdminDietitiansController {
  constructor(private readonly dietitiansService: DietitiansService) {}

  @Get()
  @ApiOperation({ summary: '[Admin] List all dietitians' })
  findAll(@Query() pagination: PaginationDto) {
    return this.dietitiansService.findAll(pagination);
  }

  @Get('pending')
  @ApiOperation({ summary: '[Admin] List pending dietitian applications' })
  findPending(@Query() pagination: PaginationDto) {
    return this.dietitiansService.findPending(pagination);
  }

  @Get(':id')
  @ApiOperation({ summary: '[Admin] Get dietitian by ID' })
  findOne(@Param('id') id: string) {
    return this.dietitiansService.findOrFail(id);
  }

  @Patch(':id/approve')
  @ApiOperation({ summary: '[Admin] Approve a dietitian application' })
  approve(@Param('id') id: string) {
    return this.dietitiansService.approve(id);
  }

  @Patch(':id/reject')
  @ApiOperation({ summary: '[Admin] Reject a dietitian application' })
  reject(@Param('id') id: string, @Body() dto: RejectDietitianDto) {
    return this.dietitiansService.reject(id, dto.reason);
  }
}
