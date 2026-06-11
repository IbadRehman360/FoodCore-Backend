import { Body, Controller, Delete, Get, Param, Patch, Post } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { InventoryService } from '../services/inventory.service';
import { CreateInventoryItemDto } from '../dto/create-inventory-item.dto';
import { UpdateInventoryItemDto } from '../dto/update-inventory-item.dto';
import { CurrentUser } from '@common/decorators';

@ApiTags('Inventory')
@ApiBearerAuth()
@Controller('inventory')
export class InventoryController {
  constructor(private readonly inventoryService: InventoryService) {}

  @Get()
  @ApiOperation({ summary: 'Get my pantry/fridge & shopping-list items' })
  @ApiResponse({ status: 200, description: 'All inventory items for the current user' })
  findMine(@CurrentUser('id') userId: string) {
    return this.inventoryService.findMine(userId);
  }

  @Post()
  @ApiOperation({ summary: 'Add an inventory item' })
  @ApiResponse({ status: 201, description: 'Item added' })
  create(@CurrentUser('id') userId: string, @Body() dto: CreateInventoryItemDto) {
    return this.inventoryService.create(userId, dto);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Update an inventory item (quantity / location / shopping-list flag)' })
  @ApiResponse({ status: 200, description: 'Item updated' })
  update(@CurrentUser('id') userId: string, @Param('id') id: string, @Body() dto: UpdateInventoryItemDto) {
    return this.inventoryService.update(userId, id, dto);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete an inventory item' })
  @ApiResponse({ status: 200, description: 'Item deleted' })
  remove(@CurrentUser('id') userId: string, @Param('id') id: string) {
    return this.inventoryService.remove(userId, id);
  }
}
