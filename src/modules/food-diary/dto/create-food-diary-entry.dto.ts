import { IsDateString, IsEnum, IsNumber, IsOptional, IsString, Min } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { MealType } from '@common/enums';

export class CreateFoodDiaryEntryDto {
  @ApiProperty({ enum: MealType }) @IsEnum(MealType) mealType: MealType;
  @ApiProperty() @IsString() foodName: string;
  @ApiProperty() @IsNumber() @Min(0) calories: number;
  @ApiProperty() @IsDateString() date: string;
  @ApiPropertyOptional() @IsOptional() @IsNumber() @Min(0) protein?: number;
  @ApiPropertyOptional() @IsOptional() @IsNumber() @Min(0) carbs?: number;
  @ApiPropertyOptional() @IsOptional() @IsNumber() @Min(0) fat?: number;
}
