import { Body, Controller, Get, Post, Query } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { FeedbackService } from '../services/feedback.service';
import { CreateFeedbackDto } from '../dto/create-feedback.dto';
import { CurrentUser } from '@common/decorators';
import { PaginationDto } from '@common/dto';

@ApiTags('Feedback')
@ApiBearerAuth()
@Controller('feedback')
export class FeedbackController {
  constructor(private readonly feedbackService: FeedbackService) {}

  @Post()
  @ApiOperation({ summary: 'Submit help / feedback' })
  @ApiResponse({ status: 201, description: 'Feedback submitted' })
  submit(@CurrentUser('id') userId: string, @Body() dto: CreateFeedbackDto) {
    return this.feedbackService.create(userId, dto);
  }

  @Get('me')
  @ApiOperation({ summary: 'Get my submitted feedback' })
  @ApiResponse({ status: 200, description: 'List of my feedback submissions' })
  findMine(@CurrentUser('id') userId: string, @Query() pagination: PaginationDto) {
    return this.feedbackService.findMine(userId, pagination);
  }
}
