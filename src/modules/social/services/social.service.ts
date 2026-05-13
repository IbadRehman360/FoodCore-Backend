import { Injectable, NotFoundException } from '@nestjs/common';
import { SocialRepository } from '../repositories/social.repository';
import { CreateSocialLinkDto } from '../dto/create-social-link.dto';
import { ERROR_MESSAGES } from '@common/constants';

@Injectable()
export class SocialService {
  constructor(private readonly socialRepo: SocialRepository) {}

  create(userId: string, dto: CreateSocialLinkDto) {
    return this.socialRepo.create({ ...dto, userId });
  }

  findByUserId(userId: string) {
    return this.socialRepo.findByUserId(userId);
  }

  async update(id: string, dto: Partial<CreateSocialLinkDto>) {
    await this.socialRepo.update(id, dto as any);
    const link = await this.socialRepo.findById(id);
    if (!link) throw new NotFoundException(ERROR_MESSAGES.SOCIAL_LINK.NOT_FOUND);
    return link;
  }

  async remove(id: string) {
    const link = await this.socialRepo.findById(id);
    if (!link) throw new NotFoundException(ERROR_MESSAGES.SOCIAL_LINK.NOT_FOUND);
    await this.socialRepo.delete(id);
    return { message: 'Social link removed.' };
  }
}
