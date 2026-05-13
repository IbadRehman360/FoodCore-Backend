import { IsString, IsUrl } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateSocialLinkDto {
  @ApiProperty({ example: 'instagram' }) @IsString() platform: string;
  @ApiProperty() @IsUrl() profileUrl: string;
}
