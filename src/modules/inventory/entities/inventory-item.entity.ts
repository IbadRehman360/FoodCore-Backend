import { Column, Entity } from 'typeorm';
import { BaseEntity } from '@database/postgres/base.entity';

@Entity('inventory_items')
export class InventoryItem extends BaseEntity {
  @Column() userId: string;
  @Column() name: string;
  @Column({ type: 'int', default: 1 }) quantity: number;
  @Column({ default: 'pantry' }) location: string; // 'fridge' | 'pantry'
  @Column({ default: false }) inShoppingList: boolean;
}
