import { IsEmail } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class ResendOtpDto {
  @ApiProperty({ example: 'alexander.benjamin@domain.com' })
  @IsEmail({}, { message: 'Please enter a valid email address.' })
  email: string;
}
