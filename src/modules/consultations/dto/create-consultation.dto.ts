import { IsDateString, IsEnum, IsInt, IsOptional, IsString, IsUUID, Min } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { ConsultationType } from '@common/enums';

export class CreateConsultationDto {
  @ApiProperty() @IsUUID() dietitianId: string;
  @ApiProperty({ enum: ConsultationType }) @IsEnum(ConsultationType) type: ConsultationType;
  @ApiProperty() @IsDateString() scheduledAt: string;
  @ApiPropertyOptional() @IsOptional() @IsInt() @Min(15) duration?: number;
  @ApiPropertyOptional() @IsOptional() @IsString() notes?: string;
}
