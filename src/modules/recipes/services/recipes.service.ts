import { ConflictException, ForbiddenException, Inject, Injectable, NotFoundException } from '@nestjs/common';
import { RecipesRepository } from '../repositories/recipes.repository';
import { RecipeFavoritesRepository } from '../repositories/recipe-favorites.repository';
import { CreateRecipeDto } from '../dto/create-recipe.dto';
import { PaginationDto } from '@common/dto';
import { paginate, paginationOffset } from '@common/utils';
import { ERROR_MESSAGES } from '@common/constants';
import { STORAGE_SERVICE, IStorageService } from '@modules/storage/storage.interface';

@Injectable()
export class RecipesService {
  constructor(
    private readonly recipesRepo: RecipesRepository,
    private readonly favoritesRepo: RecipeFavoritesRepository,
    @Inject(STORAGE_SERVICE) private readonly storage: IStorageService,
  ) {}

  create(authorId: string, dto: CreateRecipeDto) {
    return this.recipesRepo.create({ ...dto, authorId, status: 'draft' });
  }

  async findAll(pagination: PaginationDto, search?: string) {
    const { page, limit } = pagination;
    const { skip, take } = paginationOffset(page, limit);
    const [data, total] = await this.recipesRepo.findAll(skip, take, search);
    return paginate(data, total, page, limit);
  }

  async findPending(pagination: PaginationDto) {
    const { page, limit } = pagination;
    const { skip, take } = paginationOffset(page, limit);
    const [data, total] = await this.recipesRepo.findByStatus('pending_review', skip, take);
    return paginate(data, total, page, limit);
  }

  async findMyRecipes(authorId: string, status: string | undefined, pagination: PaginationDto) {
    const { page, limit } = pagination;
    const { skip, take } = paginationOffset(page, limit);
    const [data, total] = await this.recipesRepo.findByAuthorAndStatus(authorId, status, skip, take);
    return paginate(data, total, page, limit);
  }

  async findByAuthor(authorId: string, pagination: PaginationDto) {
    const { page, limit } = pagination;
    const { skip, take } = paginationOffset(page, limit);
    const [data, total] = await this.recipesRepo.findByAuthor(authorId, skip, take);
    return paginate(data, total, page, limit);
  }

  async findOrFail(id: string) {
    const recipe = await this.recipesRepo.findById(id);
    if (!recipe) throw new NotFoundException(ERROR_MESSAGES.RECIPE.NOT_FOUND);
    return recipe;
  }

  async update(id: string, authorId: string, dto: Partial<CreateRecipeDto>) {
    const recipe = await this.findOrFail(id);
    if (recipe.authorId !== authorId) throw new ForbiddenException();
    await this.recipesRepo.update(id, dto as any);
    return this.recipesRepo.findById(id);
  }

  async publish(id: string, authorId: string) {
    const recipe = await this.findOrFail(id);
    if (recipe.authorId !== authorId) throw new ForbiddenException();
    await this.recipesRepo.update(id, { status: 'pending_review' });
    return this.recipesRepo.findById(id);
  }

  async approve(id: string) {
    await this.findOrFail(id);
    await this.recipesRepo.update(id, { status: 'published' });
    return this.recipesRepo.findById(id);
  }

  async reject(id: string) {
    await this.findOrFail(id);
    await this.recipesRepo.update(id, { status: 'rejected' });
    return this.recipesRepo.findById(id);
  }

  async uploadImage(id: string, authorId: string, file: Express.Multer.File) {
    const recipe = await this.findOrFail(id);
    if (recipe.authorId !== authorId) throw new ForbiddenException();
    const url = await this.storage.savePhoto(file);
    await this.recipesRepo.update(id, { imageUrl: url });
    return this.recipesRepo.findById(id);
  }

  async remove(id: string, authorId: string) {
    const recipe = await this.findOrFail(id);
    if (recipe.authorId !== authorId) throw new ForbiddenException();
    await this.recipesRepo.remove(id);
    return { message: 'Recipe deleted.' };
  }

  // ── Favorites ────────────────────────────────────────────────────────────────

  async addFavorite(userId: string, recipeId: string) {
    await this.findOrFail(recipeId);
    const existing = await this.favoritesRepo.findOne(userId, recipeId);
    if (existing) throw new ConflictException('Already in favorites');
    await this.favoritesRepo.add(userId, recipeId);
    return { message: 'Added to favorites.' };
  }

  async removeFavorite(userId: string, recipeId: string) {
    await this.favoritesRepo.remove(userId, recipeId);
    return { message: 'Removed from favorites.' };
  }

  async isFavorite(userId: string, recipeId: string) {
    const fav = await this.favoritesRepo.findOne(userId, recipeId);
    return { isFavorite: !!fav };
  }

  async getFavorites(userId: string, pagination: PaginationDto) {
    const { page, limit } = pagination;
    const { skip, take } = paginationOffset(page, limit);
    const [favs, total] = await this.favoritesRepo.findByUser(userId, skip, take);
    const recipeIds = favs.map((f) => f.recipeId);
    if (recipeIds.length === 0) return paginate([], 0, page, limit);
    const recipes = await Promise.all(recipeIds.map((id) => this.recipesRepo.findById(id)));
    return paginate(recipes.filter(Boolean), total, page, limit);
  }
}
