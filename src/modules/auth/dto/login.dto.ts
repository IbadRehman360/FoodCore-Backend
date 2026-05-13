import { IsBoolean, IsEmail, IsOptional, IsString, MinLength } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class LoginDto {
  @ApiProperty({ example: 'alexander.benjamin@domain.com' })
  @IsEmail({}, { message: 'Please enter a valid email address.' })
  email: string;

  @ApiProperty({ example: 'SecurePass1!' })
  @IsString()
  @MinLength(8)
  password: string;

  @ApiPropertyOptional({ default: false, description: 'Extend session to 30 days' })
  @IsOptional()
  @IsBoolean()
  rememberMe?: boolean;
}
