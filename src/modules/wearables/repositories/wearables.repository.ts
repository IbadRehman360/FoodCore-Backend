import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { WearableSync } from '../entities/wearable-sync.entity';

@Injectable()
export class WearablesRepository {
  constructor(@InjectRepository(WearableSync) private readonly repo: Repository<WearableSync>) {}

  findByUserId(userId: string) { return this.repo.find({ where: { userId } }); }
  findByUserIdAndProvider(userId: string, provider: string) { return this.repo.findOne({ where: { userId, provider } }); }
  create(data: Partial<WearableSync>) { return this.repo.save(this.repo.create(data)); }
  update(id: string, data: Partial<WearableSync>) { return this.repo.update(id, data); }
}
