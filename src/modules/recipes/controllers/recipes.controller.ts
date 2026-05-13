import { Body, Controller, Delete, Get, Param, Patch, Post, Query } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { RecipesService } from '../services/recipes.service';
import { CreateRecipeDto } from '../dto/create-recipe.dto';
import { CurrentUser } from '@common/decorators';
import { PaginationDto } from '@common/dto';

@ApiTags('Recipes')
@ApiBearerAuth()
@Controller('recipes')
export class RecipesController {
  constructor(private readonly recipesService: RecipesService) {}

  @Post()
  @ApiOperation({ summary: 'Create a recipe' })
  create(@CurrentUser('id') userId: string, @Body() dto: CreateRecipeDto) {
    return this.recipesService.create(userId, dto);
  }

  @Get()
  @ApiOperation({ summary: 'List all recipes' })
  findAll(@Query() pagination: PaginationDto) {
    return this.recipesService.findAll(pagination);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get a recipe by ID' })
  findOne(@Param('id') id: string) {
    return this.recipesService.findOrFail(id);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Update a recipe' })
  update(@Param('id') id: string, @Body() dto: Partial<CreateRecipeDto>) {
    return this.recipesService.update(id, dto);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete a recipe' })
  remove(@Param('id') id: string) {
    return this.recipesService.remove(id);
  }
}
