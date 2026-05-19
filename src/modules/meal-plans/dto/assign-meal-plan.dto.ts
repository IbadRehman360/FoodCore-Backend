import { IsDateString, IsOptional, IsUUID } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class AssignMealPlanDto {
  @ApiProperty() @IsUUID() userId: string;
  @ApiPropertyOptional({ example: '2026-05-20' })
  @IsOptional() @IsDateString()
  startDate?: string;
  @ApiPropertyOptional({ example: '2026-05-26' })
  @IsOptional() @IsDateString()
  endDate?: string;
}
