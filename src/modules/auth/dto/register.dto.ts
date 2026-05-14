import { IsEmail, IsOptional, IsString, Matches, MaxLength, MinLength, Validate, ValidatorConstraint, ValidatorConstraintInterface, ValidationArguments } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

const PASSWORD_REGEX = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;

@ValidatorConstraint({ name: 'PasswordsMatch', async: false })
class PasswordsMatch implements ValidatorConstraintInterface {
  validate(confirmPassword: string, args: ValidationArguments) {
    const obj = args.object as RegisterDto;
    return obj.password === confirmPassword;
  }
  defaultMessage() {
    return 'Passwords do not match.';
  }
}

export class RegisterDto {
  @ApiProperty({ example: 'alexander.benjamin@domain.com' })
  @IsEmail({}, { message: 'Please enter a valid email address.' })
  email: string;

  @ApiProperty({ example: 'SecurePass1!' })
  @Matches(PASSWORD_REGEX, {
    message: 'Password must be 8+ characters with uppercase, lowercase, number and special character.',
  })
  password: string;

  @ApiProperty({ example: 'SecurePass1!' })
  @IsString()
  @MinLength(8)
  @Validate(PasswordsMatch)
  confirmPassword: string;

  @ApiPropertyOptional({ example: 'ref_abc123', description: 'Optional referral code from a friend' })
  @IsOptional()
  @IsString()
  @MaxLength(20)
  referralCode?: string;

  @ApiPropertyOptional({ description: 'Google reCAPTCHA v3 token (required when CAPTCHA_ENABLED=true)' })
  @IsOptional()
  @IsString()
  captchaToken?: string;
}
