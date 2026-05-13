import { IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class BarcodeScanDto {
  @ApiProperty({ description: 'Barcode or QR code value' })
  @IsString()
  barcode: string;
}
