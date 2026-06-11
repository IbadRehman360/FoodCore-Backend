import { IsDateString, IsEnum, IsInt, IsNumber, IsOptional, IsString, IsUUID, Min } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { ConsultationType } from '@common/enums';

export class CreateConsultationDto {
  @ApiProperty({ description: "The consultant's user id" }) @IsUUID() dietitianId: string;
  @ApiProperty() @IsDateString() scheduledAt: string;

  @ApiPropertyOptional({ enum: ConsultationType, default: ConsultationType.VIDEO })
  @IsOptional() @IsEnum(ConsultationType) type?: ConsultationType;

  @ApiPropertyOptional({ description: "Tier: 'initial' | 'follow_up' | 'extended'" })
  @IsOptional() @IsString() plan?: string;

  @ApiPropertyOptional() @IsOptional() @IsInt() @Min(15) duration?: number;
  @ApiPropertyOptional() @IsOptional() @IsNumber() fee?: number;
  @ApiPropertyOptional({ description: 'What the session is for' }) @IsOptional() @IsString() sessionFor?: string;
  @ApiPropertyOptional() @IsOptional() @IsString() notes?: string;
}
