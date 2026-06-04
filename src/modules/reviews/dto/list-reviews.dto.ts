import { IsEnum, IsOptional, IsPositive, Max, Min } from 'class-validator';
import { Type } from 'class-transformer';
import { ApiPropertyOptional, ApiProperty } from '@nestjs/swagger';
import { ReviewTargetType } from '../entities/review.entity';

export class ListReviewsDto {
  @ApiProperty({ enum: ReviewTargetType })
  @IsEnum(ReviewTargetType)
  targetType: ReviewTargetType;

  @ApiPropertyOptional({ default: 1 })
  @IsOptional()
  @Type(() => Number)
  @IsPositive()
  page?: number = 1;

  @ApiPropertyOptional({ default: 20 })
  @IsOptional()
  @Type(() => Number)
  @Min(1)
  @Max(100)
  limit?: number = 20;
}
