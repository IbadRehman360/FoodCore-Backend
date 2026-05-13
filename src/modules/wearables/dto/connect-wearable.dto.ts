import { IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class ConnectWearableDto {
  @ApiProperty({ example: 'fitbit' })
  @IsString()
  provider: string;

  @ApiProperty()
  @IsString()
  accessToken: string;
}
