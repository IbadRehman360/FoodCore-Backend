import { Injectable } from '@nestjs/common';
import { FeedbackRepository } from '../repositories/feedback.repository';
import { CreateFeedbackDto } from '../dto/create-feedback.dto';
import { MailService } from '@modules/mail/mail.service';
import { UsersService } from '@modules/users/services/users.service';
import { PaginationDto } from '@common/dto';
import { paginate, paginationOffset } from '@common/utils';

@Injectable()
export class FeedbackService {
  constructor(
    private readonly feedbackRepo: FeedbackRepository,
    private readonly mailService: MailService,
    private readonly usersService: UsersService,
  ) {}

  async create(userId: string, dto: CreateFeedbackDto) {
    const feedback = await this.feedbackRepo.create({
      userId,
      subject: dto.subject,
      message: dto.message,
    });
    // Best-effort admin notification — never block submission on email delivery.
    const user = await this.usersService.findById(userId);
    void this.mailService.sendFeedbackEmail(dto.subject, dto.message, user?.email ?? 'unknown');
    return feedback;
  }

  async findMine(userId: string, pagination: PaginationDto) {
    const { page, limit } = pagination;
    const { skip, take } = paginationOffset(page, limit);
    const [data, total] = await this.feedbackRepo.findByUser(userId, skip, take);
    return paginate(data, total, page, limit);
  }
}
