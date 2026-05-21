import {
  Body, Controller, Delete, Get, Param, Patch, Post,
  Query, UploadedFile, UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { memoryStorage } from 'multer';
import { ApiBearerAuth, ApiConsumes, ApiOperation, ApiTags } from '@nestjs/swagger';
import { RecipesService } from '../services/recipes.service';
import { CreateRecipeDto } from '../dto/create-recipe.dto';
import { CurrentUser, Roles } from '@common/decorators';
import { Role } from '@common/enums';
import { PaginationDto } from '@common/dto';

@ApiTags('Recipes')
@ApiBearerAuth()
@Controller('recipes')
export class RecipesController {
  constructor(private readonly recipesService: RecipesService) {}

  @Post()
  @ApiOperation({ summary: 'Create a recipe (draft by default)' })
  create(@CurrentUser('id') userId: string, @Body() dto: CreateRecipeDto) {
    return this.recipesService.create(userId, dto);
  }

  @Get('me')
  @ApiOperation({ summary: 'Get my recipes (optional ?status=draft|published)' })
  getMyRecipes(
    @CurrentUser('id') userId: string,
    @Query('status') status: string | undefined,
    @Query() pagination: PaginationDto,
  ) {
    return this.recipesService.findMyRecipes(userId, status, pagination);
  }

  @Get('favorites')
  @ApiOperation({ summary: 'Get my favorite recipes' })
  getFavorites(@CurrentUser('id') userId: string, @Query() pagination: PaginationDto) {
    return this.recipesService.getFavorites(userId, pagination);
  }

  @Get()
  @ApiOperation({ summary: 'List all published recipes' })
  findAll(@Query() pagination: PaginationDto, @Query('search') search?: string) {
    return this.recipesService.findAll(pagination, search);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get a recipe by ID' })
  findOne(@Param('id') id: string) {
    return this.recipesService.findOrFail(id);
  }

  @Get(':id/favorite')
  @ApiOperation({ summary: 'Check if recipe is in my favorites' })
  isFavorite(@Param('id') id: string, @CurrentUser('id') userId: string) {
    return this.recipesService.isFavorite(userId, id);
  }

  @Post(':id/favorite')
  @ApiOperation({ summary: 'Add recipe to favorites' })
  addFavorite(@Param('id') id: string, @CurrentUser('id') userId: string) {
    return this.recipesService.addFavorite(userId, id);
  }

  @Delete(':id/favorite')
  @ApiOperation({ summary: 'Remove recipe from favorites' })
  removeFavorite(@Param('id') id: string, @CurrentUser('id') userId: string) {
    return this.recipesService.removeFavorite(userId, id);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Update a recipe' })
  update(
    @Param('id') id: string,
    @CurrentUser('id') userId: string,
    @Body() dto: Partial<CreateRecipeDto>,
  ) {
    return this.recipesService.update(id, userId, dto);
  }

  @Patch(':id/publish')
  @ApiOperation({ summary: 'Publish a recipe' })
  publish(@Param('id') id: string, @CurrentUser('id') userId: string) {
    return this.recipesService.publish(id, userId);
  }

  @Post(':id/image')
  @ApiOperation({ summary: 'Upload recipe image' })
  @ApiConsumes('multipart/form-data')
  @UseInterceptors(FileInterceptor('file', { storage: memoryStorage() }))
  uploadImage(
    @Param('id') id: string,
    @CurrentUser('id') userId: string,
    @UploadedFile() file: Express.Multer.File,
  ) {
    return this.recipesService.uploadImage(id, userId, file);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete a recipe' })
  remove(@Param('id') id: string, @CurrentUser('id') userId: string) {
    return this.recipesService.remove(id, userId);
  }

  @Get('admin/pending')
  @Roles(Role.ADMIN, Role.SUPER_ADMIN)
  @ApiOperation({ summary: 'Admin: list recipes pending review' })
  getPending(@Query() pagination: PaginationDto) {
    return this.recipesService.findPending(pagination);
  }

  @Patch('admin/:id/approve')
  @Roles(Role.ADMIN, Role.SUPER_ADMIN)
  @ApiOperation({ summary: 'Admin: approve a recipe' })
  approve(@Param('id') id: string) {
    return this.recipesService.approve(id);
  }

  @Patch('admin/:id/reject')
  @Roles(Role.ADMIN, Role.SUPER_ADMIN)
  @ApiOperation({ summary: 'Admin: reject a recipe' })
  reject(@Param('id') id: string) {
    return this.recipesService.reject(id);
  }
}
