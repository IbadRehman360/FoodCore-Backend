import { IsEnum, IsInt, IsOptional, IsString, IsUUID, Max, Min } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { ReviewTargetType } from '../entities/review.entity';

export class CreateReviewDto {
  @ApiProperty() @IsUUID() targetId: string;
  @ApiProperty({ enum: ReviewTargetType }) @IsEnum(ReviewTargetType) targetType: ReviewTargetType;
  @ApiProperty({ minimum: 1, maximum: 5 }) @IsInt() @Min(1) @Max(5) rating: number;
  @ApiPropertyOptional() @IsOptional() @IsString() comment?: string;
}
