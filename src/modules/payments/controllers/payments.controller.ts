import { Body, Controller, Get, Param, Post, Query } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { PaymentsService } from '../services/payments.service';
import { CreateCheckoutDto } from '../dto/create-checkout.dto';
import { CurrentUser, Public } from '@common/decorators';
import { PaginationDto } from '@common/dto';

@ApiTags('Payments')
@ApiBearerAuth()
@Controller('payments')
export class PaymentsController {
  constructor(private readonly paymentsService: PaymentsService) {}

  @Post('checkout')
  @ApiOperation({ summary: 'Create a payment checkout session' })
  createCheckout(@CurrentUser('id') userId: string, @Body() dto: CreateCheckoutDto) {
    return this.paymentsService.createCheckout(userId, dto);
  }

  @Get('history')
  @ApiOperation({ summary: 'Get my payment history' })
  getHistory(@CurrentUser('id') userId: string, @Query() pagination: PaginationDto) {
    return this.paymentsService.getHistory(userId, pagination);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get payment by ID' })
  findOne(@Param('id') id: string) {
    return this.paymentsService.findOrFail(id);
  }

  @Public()
  @Post('webhook')
  @ApiOperation({ summary: 'Stripe webhook handler' })
  webhook(@Body() body: any) {
    // TODO: verify Stripe signature then call paymentsService.handleWebhook
    return { received: true };
  }
}
