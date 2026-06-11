import { Body, Controller, Get, Param, Patch, Post, Query } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { ConsultationsService } from '../services/consultations.service';
import { CreateConsultationDto } from '../dto/create-consultation.dto';
import { RescheduleConsultationDto } from '../dto/reschedule-consultation.dto';
import { CancelConsultationDto } from '../dto/cancel-consultation.dto';
import { CurrentUser, Roles } from '@common/decorators';
import { Role } from '@common/enums';
import { PaginationDto } from '@common/dto';

@ApiTags('Consultations')
@ApiBearerAuth()
@Controller('consultations')
export class ConsultationsController {
  constructor(private readonly consultationsService: ConsultationsService) {}

  @Post()
  @ApiOperation({ summary: 'Book a consultation' })
  book(@CurrentUser('id') userId: string, @Body() dto: CreateConsultationDto) {
    return this.consultationsService.book(userId, dto);
  }

  @Get('my')
  @ApiOperation({ summary: 'Get my consultations (as a user)' })
  getMyConsultations(@CurrentUser('id') userId: string, @Query() pagination: PaginationDto) {
    return this.consultationsService.getMyConsultations(userId, pagination);
  }

  @Get('dietitian')
  @Roles(Role.DIETITIAN)
  @ApiOperation({ summary: 'Get consultations assigned to me (consultant)' })
  getDietitianConsultations(@CurrentUser('id') dietitianId: string, @Query() pagination: PaginationDto) {
    return this.consultationsService.getDietitianConsultations(dietitianId, pagination);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get consultation by ID' })
  findOne(@Param('id') id: string) {
    return this.consultationsService.findOneEnriched(id);
  }

  @Patch(':id/reschedule')
  @ApiOperation({ summary: 'Reschedule a consultation' })
  reschedule(@Param('id') id: string, @Body() dto: RescheduleConsultationDto) {
    return this.consultationsService.reschedule(id, dto);
  }

  @Patch(':id/cancel')
  @ApiOperation({ summary: 'Cancel a consultation (with optional reason)' })
  cancel(@Param('id') id: string, @Body() dto: CancelConsultationDto) {
    return this.consultationsService.cancel(id, dto.reason);
  }
}
