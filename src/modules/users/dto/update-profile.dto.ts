import { IsEnum, IsInt, IsOptional, IsString, Max, Min } from 'class-validator';
import { ApiPropertyOptional } from '@nestjs/swagger';
import { Gender } from '@common/enums';

export class UpdateProfileDto {
  @ApiPropertyOptional() @IsOptional() @IsString() fullName?: string;
  @ApiPropertyOptional({ enum: Gender }) @IsOptional() @IsEnum(Gender) gender?: Gender;
  @ApiPropertyOptional() @IsOptional() @IsInt() @Min(13) @Max(120) age?: number;
  @ApiPropertyOptional() @IsOptional() height?: number;
  @ApiPropertyOptional() @IsOptional() weight?: number;
  @ApiPropertyOptional() @IsOptional() @IsString() dietaryPreferences?: string;
  @ApiPropertyOptional() @IsOptional() @IsString() medicalHistory?: string;
  @ApiPropertyOptional() @IsOptional() @IsString() fitnessGoals?: string;
  @ApiPropertyOptional() @IsOptional() @IsString() phone?: string;
}
