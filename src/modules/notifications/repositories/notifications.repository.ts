import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Notification } from '../entities/notification.entity';

@Injectable()
export class NotificationsRepository {
  constructor(@InjectRepository(Notification) private readonly repo: Repository<Notification>) {}

  create(data: Partial<Notification>) {
    return this.repo.save(this.repo.create(data));
  }

  findById(id: string) {
    return this.repo.findOne({ where: { id } });
  }

  findByUserId(userId: string, skip: number, take: number) {
    return this.repo.findAndCount({
      where: { userId },
      skip,
      take,
      order: { createdAt: 'DESC' },
    });
  }

  update(id: string, data: Partial<Notification>) {
    return this.repo.update(id, data);
  }

  markAllRead(userId: string) {
    return this.repo.update({ userId, isRead: false }, { isRead: true });
  }
}
