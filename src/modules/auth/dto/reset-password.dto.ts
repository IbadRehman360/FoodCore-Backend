import { IsEmail, IsString, Matches } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

const PASSWORD_REGEX = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;

export class ResetPasswordDto {
  @ApiProperty({ example: 'jane@example.com' })
  @IsEmail()
  email: string;

  @ApiProperty({ example: '482931' })
  @IsString()
  otp: string;

  @ApiProperty({ example: 'NewPass@123' })
  @Matches(PASSWORD_REGEX, { message: 'Password must be 8+ chars with uppercase, lowercase, number and special character' })
  newPassword: string;
}
