import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Dietitian } from '../entities/dietitian.entity';
import { VerificationStatus } from '@common/enums';

@Injectable()
export class DietitiansRepository {
  constructor(@InjectRepository(Dietitian) private readonly repo: Repository<Dietitian>) {}

  findById(id: string) {
    return this.repo.findOne({ where: { id }, relations: ['user'] });
  }

  findByUserId(userId: string) {
    return this.repo.findOne({ where: { userId }, relations: ['user'] });
  }

  findAll(skip: number, take: number) {
    return this.repo.findAndCount({ skip, take, relations: ['user'], order: { createdAt: 'DESC' } });
  }

  findByStatus(status: VerificationStatus, skip: number, take: number) {
    return this.repo.findAndCount({ where: { verificationStatus: status }, skip, take, relations: ['user'] });
  }

  create(data: Partial<Dietitian>) {
    return this.repo.save(this.repo.create(data));
  }

  update(id: string, data: Partial<Dietitian>) {
    return this.repo.update(id, data);
  }
}
