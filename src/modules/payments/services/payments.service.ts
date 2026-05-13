import { Injectable, NotFoundException } from '@nestjs/common';
import { PaymentsRepository } from '../repositories/payments.repository';
import { CreateCheckoutDto } from '../dto/create-checkout.dto';
import { PaymentStatus } from '@common/enums';
import { PaginationDto } from '@common/dto';
import { paginate, paginationOffset } from '@common/utils';
import { ERROR_MESSAGES } from '@common/constants';

@Injectable()
export class PaymentsService {
  constructor(private readonly paymentsRepo: PaymentsRepository) {}

  async createCheckout(userId: string, dto: CreateCheckoutDto) {
    // TODO: create Stripe PaymentIntent and return clientSecret
    const payment = await this.paymentsRepo.create({
      userId,
      type: dto.type,
      referenceId: dto.referenceId,
      currency: dto.currency ?? 'USD',
      amount: 0,
      status: PaymentStatus.PENDING,
    });
    return { payment, clientSecret: null };
  }

  async getHistory(userId: string, pagination: PaginationDto) {
    const { page, limit } = pagination;
    const { skip, take } = paginationOffset(page, limit);
    const [data, total] = await this.paymentsRepo.findByUserId(userId, skip, take);
    return paginate(data, total, page, limit);
  }

  async findOrFail(id: string) {
    const payment = await this.paymentsRepo.findById(id);
    if (!payment) throw new NotFoundException(ERROR_MESSAGES.PAYMENT.NOT_FOUND);
    return payment;
  }

  async handleWebhook(stripePaymentIntentId: string, status: PaymentStatus) {
    const payment = await this.paymentsRepo.findByStripeId(stripePaymentIntentId);
    if (payment) {
      await this.paymentsRepo.update(payment.id, { status });
    }
  }
}
