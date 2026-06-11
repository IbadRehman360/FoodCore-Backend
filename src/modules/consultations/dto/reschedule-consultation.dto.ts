import { IsDateString, IsInt, IsNumber, IsOptional, IsString, Min } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class RescheduleConsultationDto {
  @ApiProperty() @IsDateString() scheduledAt: string;
  @ApiPropertyOptional({ description: "Tier: 'initial' | 'follow_up' | 'extended'" })
  @IsOptional() @IsString() plan?: string;
  @ApiPropertyOptional() @IsOptional() @IsInt() @Min(15) duration?: number;
  @ApiPropertyOptional() @IsOptional() @IsNumber() fee?: number;
  @ApiPropertyOptional() @IsOptional() @IsString() sessionFor?: string;
  @ApiPropertyOptional() @IsOptional() @IsString() notes?: string;
}
