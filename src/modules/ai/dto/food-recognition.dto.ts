import { IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class FoodRecognitionDto {
  @ApiProperty({ description: 'Base64 encoded image string' })
  @IsString()
  imageBase64: string;
}
