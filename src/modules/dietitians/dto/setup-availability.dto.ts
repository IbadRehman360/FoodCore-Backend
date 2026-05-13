import { Type } from 'class-transformer';
import { IsArray, IsBoolean, IsOptional, IsString, Matches, ValidateNested } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

const TIME_REGEX = /^([01]\d|2[0-3]):([0-5]\d)$/;

class TimeSlotDto {
  @ApiProperty({ example: '10:00' })
  @IsString()
  @Matches(TIME_REGEX, { message: 'Time must be in HH:mm format (24h)' })
  from: string;

  @ApiProperty({ example: '12:00' })
  @IsString()
  @Matches(TIME_REGEX, { message: 'Time must be in HH:mm format (24h)' })
  to: string;
}

class DayScheduleDto {
  @ApiProperty()
  @IsBoolean()
  enabled: boolean;

  @ApiProperty({ type: [TimeSlotDto] })
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => TimeSlotDto)
  slots: TimeSlotDto[];
}

export class SetupAvailabilityDto {
  @ApiProperty({ example: 'America/New_York' })
  @IsString()
  timezone: string;

  @ApiPropertyOptional({ type: DayScheduleDto })
  @IsOptional() @ValidateNested() @Type(() => DayScheduleDto)
  monday?: DayScheduleDto;

  @ApiPropertyOptional({ type: DayScheduleDto })
  @IsOptional() @ValidateNested() @Type(() => DayScheduleDto)
  tuesday?: DayScheduleDto;

  @ApiPropertyOptional({ type: DayScheduleDto })
  @IsOptional() @ValidateNested() @Type(() => DayScheduleDto)
  wednesday?: DayScheduleDto;

  @ApiPropertyOptional({ type: DayScheduleDto })
  @IsOptional() @ValidateNested() @Type(() => DayScheduleDto)
  thursday?: DayScheduleDto;

  @ApiPropertyOptional({ type: DayScheduleDto })
  @IsOptional() @ValidateNested() @Type(() => DayScheduleDto)
  friday?: DayScheduleDto;

  @ApiPropertyOptional({ type: DayScheduleDto })
  @IsOptional() @ValidateNested() @Type(() => DayScheduleDto)
  saturday?: DayScheduleDto;

  @ApiPropertyOptional({ type: DayScheduleDto })
  @IsOptional() @ValidateNested() @Type(() => DayScheduleDto)
  sunday?: DayScheduleDto;
}
