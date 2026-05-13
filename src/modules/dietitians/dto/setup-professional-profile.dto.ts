import { Type } from 'class-transformer';
import { IsArray, IsNumber, IsOptional, IsString, IsUrl, Min, ValidateNested } from 'class-validator';
import { ApiPropertyOptional } from '@nestjs/swagger';

class SocialLinksDto {
  @ApiPropertyOptional({ example: 'https://www.instagram.com/username' })
  @IsOptional()
  @IsUrl()
  instagram?: string;

  @ApiPropertyOptional({ example: 'https://www.facebook.com/username' })
  @IsOptional()
  @IsUrl()
  facebook?: string;

  @ApiPropertyOptional({ example: 'https://www.linkedin.com/in/username' })
  @IsOptional()
  @IsUrl()
  linkedin?: string;

  @ApiPropertyOptional({ example: 'https://x.com/username' })
  @IsOptional()
  @IsUrl()
  twitter?: string;
}

class SessionFeesDto {
  @ApiPropertyOptional({ example: 50, description: 'Initial consultation — 30 min (USD)' })
  @IsOptional()
  @IsNumber()
  @Min(0)
  initial30?: number;

  @ApiPropertyOptional({ example: 80, description: 'Follow-up consultation — 60 min (USD)' })
  @IsOptional()
  @IsNumber()
  @Min(0)
  followUp60?: number;

  @ApiPropertyOptional({ example: 120, description: 'Extended consultation — 90 min (USD)' })
  @IsOptional()
  @IsNumber()
  @Min(0)
  extended90?: number;
}

export class SetupProfessionalProfileDto {
  @ApiPropertyOptional({ example: 'Clinical Nutritionist' })
  @IsOptional()
  @IsString()
  occupation?: string;

  @ApiPropertyOptional({
    type: [String],
    example: ['Personalized meal planning', 'Nutritional counseling and education'],
  })
  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  services?: string[];

  @ApiPropertyOptional({ example: 'I am a certified nutritionist with 10 years of experience...' })
  @IsOptional()
  @IsString()
  bio?: string;

  @ApiPropertyOptional({ type: SocialLinksDto })
  @IsOptional()
  @ValidateNested()
  @Type(() => SocialLinksDto)
  socialLinks?: SocialLinksDto;

  @ApiPropertyOptional({ type: SessionFeesDto })
  @IsOptional()
  @ValidateNested()
  @Type(() => SessionFeesDto)
  sessionFees?: SessionFeesDto;
}
