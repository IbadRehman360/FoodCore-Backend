import { Controller, Get, Param, Query } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiQuery, ApiTags } from '@nestjs/swagger';
import { FoodsService } from '../services/foods.service';

@ApiTags('Foods')
@ApiBearerAuth()
@Controller('foods')
export class FoodsController {
  constructor(private readonly foodsService: FoodsService) {}

  @Get()
  @ApiOperation({ summary: 'Search foods catalog by name' })
  @ApiQuery({ name: 'q', required: false, example: 'chicken' })
  search(@Query('q') q = '') {
    return this.foodsService.search(q);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get a food item by id' })
  findOne(@Param('id') id: string) {
    return this.foodsService.findOrFail(id);
  }
}
