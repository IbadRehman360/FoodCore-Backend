import { IsEnum, IsOptional, IsString, IsUUID } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { PaymentType } from '../entities/payment.entity';

export class CreateCheckoutDto {
  @ApiProperty({ enum: PaymentType }) @IsEnum(PaymentType) type: PaymentType;
  @ApiPropertyOptional() @IsOptional() @IsUUID() referenceId?: string;
  @ApiPropertyOptional() @IsOptional() @IsString() currency?: string;
}
