import { ForbiddenException, Injectable, NotFoundException } from '@nestjs/common';
import { InventoryRepository } from '../repositories/inventory.repository';
import { CreateInventoryItemDto } from '../dto/create-inventory-item.dto';
import { UpdateInventoryItemDto } from '../dto/update-inventory-item.dto';

@Injectable()
export class InventoryService {
  constructor(private readonly inventoryRepo: InventoryRepository) {}

  create(userId: string, dto: CreateInventoryItemDto) {
    return this.inventoryRepo.create({
      userId,
      name: dto.name,
      quantity: dto.quantity ?? 1,
      location: dto.location ?? 'pantry',
      inShoppingList: dto.inShoppingList ?? false,
    });
  }

  findMine(userId: string) {
    return this.inventoryRepo.findByUser(userId);
  }

  private async findOwned(userId: string, id: string) {
    const item = await this.inventoryRepo.findById(id);
    if (!item) throw new NotFoundException('Inventory item not found.');
    if (item.userId !== userId) throw new ForbiddenException();
    return item;
  }

  async update(userId: string, id: string, dto: UpdateInventoryItemDto) {
    await this.findOwned(userId, id);
    await this.inventoryRepo.update(id, dto);
    return this.inventoryRepo.findById(id);
  }

  async remove(userId: string, id: string) {
    await this.findOwned(userId, id);
    await this.inventoryRepo.delete(id);
    return { message: 'Item removed.' };
  }
}
