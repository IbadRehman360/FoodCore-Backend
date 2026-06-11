import { IsNotEmpty, IsString, MaxLength, MinLength } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateFeedbackDto {
  @ApiProperty({ example: 'App crashes on login' })
  @IsString()
  @IsNotEmpty()
  @MaxLength(150)
  subject: string;

  @ApiProperty({ example: 'The app closes whenever I tap the login button.' })
  @IsString()
  @IsNotEmpty()
  @MinLength(5)
  @MaxLength(2000)
  message: string;
}
