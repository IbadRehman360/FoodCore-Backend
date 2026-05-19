import { ArrayMaxSize, IsArray, IsBoolean, IsInt, IsOptional, IsString, Matches, Max, Min } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class SetWaterRemindersDto {
  @ApiProperty({ example: true })
  @IsBoolean()
  enabled: boolean;

  @ApiPropertyOptional({
    type: [String],
    example: ['08:00', '11:00', '14:00', '17:00', '20:00'],
    description: 'List of HH:mm reminder times (24h)',
  })
  @IsOptional()
  @IsArray() @ArrayMaxSize(24)
  @IsString({ each: true })
  @Matches(/^([01]\d|2[0-3]):[0-5]\d$/, { each: true, message: 'Use HH:mm 24h format' })
  times?: string[];

  @ApiPropertyOptional({ example: 60, description: 'Fallback interval if `times` not set' })
  @IsOptional() @IsInt() @Min(15) @Max(720)
  intervalMinutes?: number;

  @ApiPropertyOptional({ example: 'Africa/Casablanca' })
  @IsOptional() @IsString()
  timezone?: string;
}
