import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { ILike, Repository } from 'typeorm';
import { Food } from '../entities/food.entity';

@Injectable()
export class FoodsRepository {
  constructor(@InjectRepository(Food) private readonly repo: Repository<Food>) {}

  findById(id: string) {
    return this.repo.findOne({ where: { id } });
  }

  search(query: string, take = 50) {
    if (!query || query.trim().length === 0) {
      return this.repo.find({ take, order: { name: 'ASC' } });
    }
    return this.repo.find({
      where: { name: ILike(`%${query.trim()}%`) },
      take,
      order: { name: 'ASC' },
    });
  }

  count() {
    return this.repo.count();
  }

  bulkInsert(items: Partial<Food>[]) {
    return this.repo.save(items.map((i) => this.repo.create(i)));
  }
}
