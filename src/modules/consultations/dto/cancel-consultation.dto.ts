import { IsOptional, IsString } from 'class-validator';
import { ApiPropertyOptional } from '@nestjs/swagger';

export class CancelConsultationDto {
  @ApiPropertyOptional({ description: 'Reason for cancellation' })
  @IsOptional() @IsString() reason?: string;
}
