import { IsBoolean, IsDateString, IsEnum, IsOptional, IsString } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { MealPlanType } from '../entities/meal-plan.entity';

export class CreateMealPlanDto {
  @ApiProperty({ example: '7-Day Weight Loss Plan' })
  @IsString()
  title: string;

  @ApiPropertyOptional()
  @IsOptional() @IsString()
  description?: string;

  @ApiPropertyOptional({ enum: MealPlanType, default: MealPlanType.WEEKLY })
  @IsOptional() @IsEnum(MealPlanType)
  planType?: MealPlanType;

  @ApiPropertyOptional({ example: '2026-05-20' })
  @IsOptional() @IsDateString()
  startDate?: string;

  @ApiPropertyOptional({ example: '2026-05-26' })
  @IsOptional() @IsDateString()
  endDate?: string;

  @ApiPropertyOptional({ description: 'Save as reusable template (not assigned to a user)' })
  @IsOptional() @IsBoolean()
  isTemplate?: boolean;
}
