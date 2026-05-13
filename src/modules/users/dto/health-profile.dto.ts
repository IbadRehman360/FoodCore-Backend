import { IsArray, IsNumber, IsOptional, IsString, Max, Min } from 'class-validator';
import { ApiPropertyOptional } from '@nestjs/swagger';
import { Type } from 'class-transformer';

export class HealthProfileDto {
  @ApiPropertyOptional({ example: 'Lose weight, improve digestion.' })
  @IsOptional()
  @IsString()
  healthGoals?: string;

  @ApiPropertyOptional({ example: 70, description: 'Weight in lbs' })
  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  @Min(0)
  @Max(700)
  weight?: number;

  @ApiPropertyOptional({ type: [String], example: ['fatigue', 'bloating'] })
  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  symptoms?: string[];

  @ApiPropertyOptional({ type: [String], example: ['gluten', 'dairy'] })
  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  foodAllergies?: string[];

  @ApiPropertyOptional({ example: 'Vegan' })
  @IsOptional()
  @IsString()
  mealPersonalization?: string;
}
