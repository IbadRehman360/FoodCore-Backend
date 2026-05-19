import { IsDateString, IsNumber, IsOptional, IsString, Max, Min } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class LogWeightDto {
  @ApiProperty({ example: '2026-05-19' })
  @IsDateString()
  date: string;

  @ApiProperty({ example: 72.5, description: 'Weight in lbs' })
  @IsNumber() @Min(20) @Max(700)
  weight: number;

  @ApiPropertyOptional()
  @IsOptional() @IsString()
  notes?: string;
}
