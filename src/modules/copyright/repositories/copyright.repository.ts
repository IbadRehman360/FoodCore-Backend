import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CopyrightAgreement } from '../entities/copyright-agreement.entity';

@Injectable()
export class CopyrightRepository {
  constructor(@InjectRepository(CopyrightAgreement) private readonly repo: Repository<CopyrightAgreement>) {}

  findByUserId(userId: string) {
    return this.repo.findOne({ where: { userId }, order: { createdAt: 'DESC' } });
  }

  create(data: Partial<CopyrightAgreement>) {
    return this.repo.save(this.repo.create(data));
  }
}
