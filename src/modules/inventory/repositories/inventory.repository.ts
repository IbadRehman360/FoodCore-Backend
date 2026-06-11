import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { InventoryItem } from '../entities/inventory-item.entity';

@Injectable()
export class InventoryRepository {
  constructor(@InjectRepository(InventoryItem) private readonly repo: Repository<InventoryItem>) {}

  create(data: Partial<InventoryItem>) {
    return this.repo.save(this.repo.create(data));
  }

  findByUser(userId: string) {
    return this.repo.find({ where: { userId }, order: { createdAt: 'DESC' } });
  }

  findById(id: string) {
    return this.repo.findOne({ where: { id } });
  }

  update(id: string, data: Partial<InventoryItem>) {
    return this.repo.update(id, data);
  }

  delete(id: string) {
    return this.repo.delete(id);
  }
}
