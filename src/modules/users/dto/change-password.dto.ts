import {
  IsNotEmpty, IsString, Matches, Validate,
  ValidatorConstraint, ValidatorConstraintInterface, ValidationArguments,
} from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

const PASSWORD_REGEX = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;

@ValidatorConstraint({ name: 'NewPasswordsMatch', async: false })
class NewPasswordsMatch implements ValidatorConstraintInterface {
  validate(confirmPassword: string, args: ValidationArguments) {
    return (args.object as ChangePasswordDto).newPassword === confirmPassword;
  }
  defaultMessage() { return 'Passwords do not match.'; }
}

export class ChangePasswordDto {
  @ApiProperty({ example: 'OldPass1!' })
  @IsString()
  @IsNotEmpty()
  currentPassword: string;

  @ApiProperty({ example: 'NewPass2@', description: '8+ chars with uppercase, lowercase, number, special char' })
  @Matches(PASSWORD_REGEX, { message: 'Password must be 8+ characters with uppercase, lowercase, number and special character.' })
  newPassword: string;

  @ApiProperty({ example: 'NewPass2@' })
  @IsString()
  @Validate(NewPasswordsMatch)
  confirmPassword: string;
}
