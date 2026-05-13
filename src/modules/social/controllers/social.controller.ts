import { Body, Controller, Delete, Get, Param, Patch, Post } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { SocialService } from '../services/social.service';
import { CreateSocialLinkDto } from '../dto/create-social-link.dto';
import { CurrentUser } from '@common/decorators';

@ApiTags('Social')
@ApiBearerAuth()
@Controller('social')
export class SocialController {
  constructor(private readonly socialService: SocialService) {}

  @Post()
  @ApiOperation({ summary: 'Add a social link' })
  create(@CurrentUser('id') userId: string, @Body() dto: CreateSocialLinkDto) {
    return this.socialService.create(userId, dto);
  }

  @Get()
  @ApiOperation({ summary: 'Get my social links' })
  findMy(@CurrentUser('id') userId: string) {
    return this.socialService.findByUserId(userId);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Update a social link' })
  update(@Param('id') id: string, @Body() dto: Partial<CreateSocialLinkDto>) {
    return this.socialService.update(id, dto);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Remove a social link' })
  remove(@Param('id') id: string) {
    return this.socialService.remove(id);
  }
}
