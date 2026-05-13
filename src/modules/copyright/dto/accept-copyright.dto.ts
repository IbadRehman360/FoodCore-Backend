import { IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class AcceptCopyrightDto {
  @ApiProperty({ example: '1.0.0' })
  @IsString()
  version: string;
}
