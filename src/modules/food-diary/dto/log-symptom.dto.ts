import { ArrayMinSize, IsArray, IsDateString, IsInt, IsOptional, IsString, Max, Min } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class LogSymptomDto {
  @ApiProperty({ example: '2026-05-19' })
  @IsDateString()
  date: string;

  @ApiProperty({ example: ['bloating', 'fatigue'], type: [String] })
  @IsArray() @ArrayMinSize(1) @IsString({ each: true })
  symptoms: string[];

  @ApiPropertyOptional({ example: 6, description: 'Severity 1-10' })
  @IsOptional() @IsInt() @Min(0) @Max(10)
  severity?: number;

  @ApiPropertyOptional()
  @IsOptional() @IsString()
  notes?: string;
}
