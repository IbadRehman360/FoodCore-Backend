import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { RecipeFavorite } from '../entities/recipe-favorite.entity';

@Injectable()
export class RecipeFavoritesRepository {
  constructor(
    @InjectRepository(RecipeFavorite) private readonly repo: Repository<RecipeFavorite>,
  ) {}

  findByUser(userId: string, skip: number, take: number) {
    return this.repo.findAndCount({ where: { userId }, skip, take, order: { createdAt: 'DESC' } });
  }

  findOne(userId: string, recipeId: string) {
    return this.repo.findOne({ where: { userId, recipeId } });
  }

  add(userId: string, recipeId: string) {
    return this.repo.save(this.repo.create({ userId, recipeId }));
  }

  remove(userId: string, recipeId: string) {
    return this.repo.delete({ userId, recipeId });
  }
}
