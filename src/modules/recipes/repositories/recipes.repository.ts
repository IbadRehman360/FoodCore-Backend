import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { ILike, Repository } from 'typeorm';
import { Recipe } from '../entities/recipe.entity';

@Injectable()
export class RecipesRepository {
  constructor(@InjectRepository(Recipe) private readonly repo: Repository<Recipe>) {}

  create(data: Partial<Recipe>) {
    return this.repo.save(this.repo.create(data));
  }

  findById(id: string) {
    return this.repo.findOne({ where: { id }, relations: ['author'] });
  }

  findAll(skip: number, take: number, search?: string) {
    const where: any = { status: 'published' };
    if (search) where.title = ILike(`%${search}%`);
    return this.repo.findAndCount({ where, skip, take, relations: ['author'], order: { createdAt: 'DESC' } });
  }

  findByStatus(status: string, skip: number, take: number) {
    return this.repo.findAndCount({ where: { status }, skip, take, relations: ['author'], order: { createdAt: 'DESC' } });
  }

  findByAuthor(authorId: string, skip: number, take: number) {
    return this.repo.findAndCount({ where: { authorId }, skip, take, relations: ['author'], order: { createdAt: 'DESC' } });
  }

  findByAuthorAndStatus(authorId: string, status: string | undefined, skip: number, take: number) {
    const where: any = { authorId };
    if (status) where.status = status;
    return this.repo.findAndCount({ where, skip, take, relations: ['author'], order: { createdAt: 'DESC' } });
  }

  update(id: string, data: Partial<Recipe>) {
    return this.repo.update(id, data);
  }

  remove(id: string) {
    return this.repo.softDelete(id);
  }
}
