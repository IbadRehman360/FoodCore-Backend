import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from '../entities/user.entity';

@Injectable()
export class UsersRepository {
  constructor(@InjectRepository(User) private readonly repo: Repository<User>) {}

  findById(id: string) {
    return this.repo.findOne({ where: { id } });
  }

  findByEmail(email: string) {
    return this.repo.findOne({ where: { email } });
  }

  findByUsername(username: string) {
    return this.repo.findOne({ where: { username } });
  }

  findByEmailOrUsername(email: string, username: string) {
    return this.repo.findOne({ where: [{ email }, { username }] });
  }

  findByEmailWithPassword(email: string) {
    return this.repo
      .createQueryBuilder('user')
      .addSelect('user.password')
      .where('user.email = :email', { email })
      .getOne();
  }

  create(data: Partial<User>) {
    const user = this.repo.create(data);
    return this.repo.save(user);
  }

  save(user: User) {
    return this.repo.save(user);
  }

  update(id: string, data: Partial<User>) {
    return this.repo.update(id, data);
  }

  findAll(skip: number, take: number) {
    return this.repo.findAndCount({ skip, take, order: { createdAt: 'DESC' } });
  }
}
