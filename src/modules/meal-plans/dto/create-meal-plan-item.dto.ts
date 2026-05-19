import { IsEnum, IsInt, IsNumber, IsOptional, IsString, IsUUID, Max, Min } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { MealType } from '@common/enums';

export class CreateMealPlanItemDto {
  @ApiProperty({ enum: MealType })
  @IsEnum(MealType)
  mealType: MealType;

  @ApiPropertyOptional({ example: 0, description: '0 = day 1, 6 = day 7 (weekly plan)' })
  @IsOptional() @IsInt() @Min(0) @Max(30)
  dayOffset?: number;

  @ApiPropertyOptional({ description: 'foodId from /foods catalog (omit for ad-hoc)' })
  @IsOptional() @IsUUID()
  foodId?: string;

  @ApiPropertyOptional()
  @IsOptional() @IsString()
  foodName?: string;

  @ApiPropertyOptional({ default: 1 })
  @IsOptional() @IsNumber() @Min(0.1)
  quantity?: number;

  @ApiPropertyOptional() @IsOptional() @IsNumber() @Min(0) calories?: number;
  @ApiPropertyOptional() @IsOptional() @IsNumber() @Min(0) protein?: number;
  @ApiPropertyOptional() @IsOptional() @IsNumber() @Min(0) carbs?: number;
  @ApiPropertyOptional() @IsOptional() @IsNumber() @Min(0) fat?: number;

  @ApiPropertyOptional() @IsOptional() @IsString() notes?: string;
}
