import { IsDateString, IsInt, IsOptional, IsString, Min } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class LogWaterDto {
  @ApiProperty({ example: 250, description: 'Amount in ml' })
  @IsInt() @Min(1)
  amount: number;

  @ApiProperty({ example: '2026-05-19' })
  @IsDateString()
  date: string;

  @ApiPropertyOptional({ example: 'cup' })
  @IsOptional() @IsString()
  source?: string;
}
