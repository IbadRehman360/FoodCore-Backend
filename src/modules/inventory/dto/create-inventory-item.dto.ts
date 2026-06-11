import { IsBoolean, IsIn, IsInt, IsNotEmpty, IsOptional, IsString, MaxLength, Min } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class CreateInventoryItemDto {
  @ApiProperty({ example: 'Eggs' })
  @IsString()
  @IsNotEmpty()
  @MaxLength(100)
  name: string;

  @ApiPropertyOptional({ example: 8 })
  @IsOptional()
  @IsInt()
  @Min(0)
  quantity?: number;

  @ApiPropertyOptional({ enum: ['fridge', 'pantry'] })
  @IsOptional()
  @IsIn(['fridge', 'pantry'])
  location?: string;

  @ApiPropertyOptional({ example: false })
  @IsOptional()
  @IsBoolean()
  inShoppingList?: boolean;
}
