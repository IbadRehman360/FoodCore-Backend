import { IsDateString, IsInt, IsOptional, Min } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class LogWaterDto {
  @ApiProperty({ description: 'Amount in ml' }) @IsInt() @Min(1) amount: number;
  @ApiProperty() @IsDateString() date: string;
  @ApiPropertyOptional({ description: 'Daily goal in ml' }) @IsOptional() @IsInt() @Min(500) goal?: number;
}
