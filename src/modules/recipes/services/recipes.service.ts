import { Injectable, NotFoundException } from '@nestjs/common';
import { RecipesRepository } from '../repositories/recipes.repository';
import { CreateRecipeDto } from '../dto/create-recipe.dto';
import { PaginationDto } from '@common/dto';
import { paginate, paginationOffset } from '@common/utils';
import { ERROR_MESSAGES } from '@common/constants';

@Injectable()
export class RecipesService {
  constructor(private readonly recipesRepo: RecipesRepository) {}

  create(authorId: string, dto: CreateRecipeDto) {
    return this.recipesRepo.create({ ...dto, authorId });
  }

  async findAll(pagination: PaginationDto) {
    const { page, limit } = pagination;
    const { skip, take } = paginationOffset(page, limit);
    const [data, total] = await this.recipesRepo.findAll(skip, take);
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

  async update(id: string, dto: Partial<CreateRecipeDto>) {
    await this.findOrFail(id);
    await this.recipesRepo.update(id, dto as any);
    return this.recipesRepo.findById(id);
  }

  async remove(id: string) {
    await this.findOrFail(id);
    await this.recipesRepo.remove(id);
    return { message: 'Recipe deleted.' };
  }
}
