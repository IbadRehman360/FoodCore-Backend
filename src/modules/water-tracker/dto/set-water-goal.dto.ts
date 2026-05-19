import { IsInt, Max, Min } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class SetWaterGoalDto {
  @ApiProperty({ example: 2500, description: 'Daily water goal in ml' })
  @IsInt() @Min(500) @Max(10000)
  goal: number;
}
