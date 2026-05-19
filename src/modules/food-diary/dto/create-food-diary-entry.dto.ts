import { IsDateString, IsEnum, IsNumber, IsOptional, IsString, IsUUID, Min } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { MealType } from '@common/enums';

export class CreateFoodDiaryEntryDto {
  @ApiProperty({ enum: MealType }) @IsEnum(MealType) mealType: MealType;

  @ApiProperty({ example: '2026-05-19' }) @IsDateString() date: string;

  @ApiPropertyOptional({ description: 'Food id from /foods catalog (omit for ad-hoc entry)' })
  @IsOptional() @IsUUID()
  foodId?: string;

  @ApiPropertyOptional({ description: 'Servings (multiplier on food nutrients)', example: 1.5 })
  @IsOptional() @IsNumber() @Min(0.1)
  quantity?: number;

  @ApiPropertyOptional({ description: 'Custom food name (for ad-hoc entry)' })
  @IsOptional() @IsString()
  foodName?: string;

  @ApiPropertyOptional() @IsOptional() @IsNumber() @Min(0) calories?: number;
  @ApiPropertyOptional() @IsOptional() @IsNumber() @Min(0) protein?: number;
  @ApiPropertyOptional() @IsOptional() @IsNumber() @Min(0) carbs?: number;
  @ApiPropertyOptional() @IsOptional() @IsNumber() @Min(0) fat?: number;
}
