import { IsArray, IsBoolean, IsObject, IsOptional, IsString } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class CreateRecipeDto {
  @ApiProperty() @IsString() title: string;
  @ApiProperty({ type: [String] }) @IsArray() @IsString({ each: true }) ingredients: string[];
  @ApiProperty() @IsString() instructions: string;
  @ApiPropertyOptional() @IsOptional() @IsObject() nutritionInfo?: Record<string, number>;
  @ApiPropertyOptional() @IsOptional() @IsString() category?: string;
  @ApiPropertyOptional() @IsOptional() @IsString() imageUrl?: string;
  @ApiPropertyOptional() @IsOptional() @IsBoolean() isWatermarked?: boolean;
}
