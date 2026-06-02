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

  searchApproved(opts: { skip: number; take: number; search?: string; specialty?: string; location?: string; minRating?: number }) {
    const qb = this.repo.createQueryBuilder('d')
      .leftJoinAndSelect('d.user', 'user')
      .where('d.verificationStatus = :status', { status: VerificationStatus.VERIFIED });

    if (opts.search) {
      qb.andWhere('LOWER(user.fullName) LIKE :search', { search: `%${opts.search.toLowerCase()}%` });
    }
    if (opts.specialty) {
      qb.andWhere(':specialty = ANY(d.specialties)', { specialty: opts.specialty });
    }
    if (opts.location) {
      qb.andWhere('(LOWER(user.city) LIKE :loc OR LOWER(user.state) LIKE :loc OR LOWER(user.country) LIKE :loc)', { loc: `%${opts.location.toLowerCase()}%` });
    }
    if (opts.minRating !== undefined) {
      qb.andWhere('d.rating >= :minRating', { minRating: opts.minRating });
    }

    return qb.skip(opts.skip).take(opts.take).orderBy('d.rating', 'DESC').getManyAndCount();
  }

  create(data: Partial<Dietitian>) {
    return this.repo.save(this.repo.create(data));
  }

  update(id: string, data: Partial<Dietitian>) {
    return this.repo.update(id, data);
  }
}
