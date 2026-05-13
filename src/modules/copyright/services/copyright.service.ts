import { Injectable } from '@nestjs/common';
import { CopyrightRepository } from '../repositories/copyright.repository';
import { AcceptCopyrightDto } from '../dto/accept-copyright.dto';

@Injectable()
export class CopyrightService {
  constructor(private readonly copyrightRepo: CopyrightRepository) {}

  accept(userId: string, dto: AcceptCopyrightDto) {
    return this.copyrightRepo.create({ userId, version: dto.version, acceptedAt: new Date() });
  }

  async check(userId: string) {
    const agreement = await this.copyrightRepo.findByUserId(userId);
    return { accepted: !!agreement, agreement };
  }
}
