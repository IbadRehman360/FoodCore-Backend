import { Injectable, NotFoundException } from '@nestjs/common';
import { NotificationsRepository } from '../repositories/notifications.repository';
import { NotificationType } from '../entities/notification.entity';
import { PaginationDto } from '@common/dto';
import { paginate, paginationOffset } from '@common/utils';
import { ERROR_MESSAGES } from '@common/constants';

@Injectable()
export class NotificationsService {
  constructor(private readonly notificationsRepo: NotificationsRepository) {}

  async getMyNotifications(userId: string, pagination: PaginationDto) {
    const { page, limit } = pagination;
    const { skip, take } = paginationOffset(page, limit);
    const [data, total] = await this.notificationsRepo.findByUserId(userId, skip, take);
    return paginate(data, total, page, limit);
  }

  async markRead(id: string) {
    const notification = await this.notificationsRepo.findById(id);
    if (!notification) throw new NotFoundException(ERROR_MESSAGES.NOTIFICATION.NOT_FOUND);
    await this.notificationsRepo.update(id, { isRead: true });
    return this.notificationsRepo.findById(id);
  }

  async markAllRead(userId: string) {
    await this.notificationsRepo.markAllRead(userId);
    return { message: 'All notifications marked as read.' };
  }

  send(userId: string, title: string, body: string, type: NotificationType = NotificationType.SYSTEM, data?: Record<string, any>) {
    return this.notificationsRepo.create({ userId, title, body, type, data });
  }
}
