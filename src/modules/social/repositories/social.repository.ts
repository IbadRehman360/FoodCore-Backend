import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { SocialLink } from '../entities/social-link.entity';

@Injectable()
export class SocialRepository {
  constructor(@InjectRepository(SocialLink) private readonly repo: Repository<SocialLink>) {}

  findById(id: string) { return this.repo.findOne({ where: { id } }); }
  findByUserId(userId: string) { return this.repo.find({ where: { userId } }); }
  create(data: Partial<SocialLink>) { return this.repo.save(this.repo.create(data)); }
  update(id: string, data: Partial<SocialLink>) { return this.repo.update(id, data); }
  delete(id: string) { return this.repo.softDelete(id); }
}
