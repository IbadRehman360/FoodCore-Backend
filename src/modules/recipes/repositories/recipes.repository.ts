import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Recipe } from '../entities/recipe.entity';

@Injectable()
export class RecipesRepository {
  constructor(@InjectRepository(Recipe) private readonly repo: Repository<Recipe>) {}

  create(data: Partial<Recipe>) {
    return this.repo.save(this.repo.create(data));
  }

  findById(id: string) {
    return this.repo.findOne({ where: { id } });
  }

  findAll(skip: number, take: number) {
    return this.repo.findAndCount({ skip, take, order: { createdAt: 'DESC' } });
  }

  findByAuthor(authorId: string, skip: number, take: number) {
    return this.repo.findAndCount({ where: { authorId }, skip, take, order: { createdAt: 'DESC' } });
  }

  update(id: string, data: Partial<Recipe>) {
    return this.repo.update(id, data);
  }

  remove(id: string) {
    return this.repo.softDelete(id);
  }
}
