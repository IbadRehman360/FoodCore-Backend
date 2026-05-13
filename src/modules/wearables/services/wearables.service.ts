import { Injectable } from '@nestjs/common';
import { WearablesRepository } from '../repositories/wearables.repository';
import { ConnectWearableDto } from '../dto/connect-wearable.dto';

@Injectable()
export class WearablesService {
  constructor(private readonly wearablesRepo: WearablesRepository) {}

  async connect(userId: string, dto: ConnectWearableDto) {
    // TODO: exchange accessToken with provider API and persist sync record
    const existing = await this.wearablesRepo.findByUserIdAndProvider(userId, dto.provider);
    if (existing) {
      await this.wearablesRepo.update(existing.id, { lastSyncAt: new Date() });
      return this.wearablesRepo.findByUserIdAndProvider(userId, dto.provider);
    }
    return this.wearablesRepo.create({ userId, provider: dto.provider, lastSyncAt: new Date() });
  }

  getConnected(userId: string) {
    return this.wearablesRepo.findByUserId(userId);
  }

  async sync(userId: string, provider: string) {
    // TODO: pull latest data from provider API and update data field
    const record = await this.wearablesRepo.findByUserIdAndProvider(userId, provider);
    if (record) {
      await this.wearablesRepo.update(record.id, { lastSyncAt: new Date() });
    }
    return { message: `Sync with ${provider} triggered.` };
  }
}
