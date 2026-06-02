import { Body, Controller, Delete, Get, Param, Post, Query } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiQuery, ApiTags } from '@nestjs/swagger';
import { ReviewsService } from '../services/reviews.service';
import { CreateReviewDto } from '../dto/create-review.dto';
import { ReviewTargetType } from '../entities/review.entity';
import { CurrentUser } from '@common/decorators';
import { PaginationDto } from '@common/dto';

@ApiTags('Reviews')
@ApiBearerAuth()
@Controller('reviews')
export class ReviewsController {
  constructor(private readonly reviewsService: ReviewsService) {}

  @Post()
  @ApiOperation({ summary: 'Submit a review' })
  submit(@CurrentUser('id') reviewerId: string, @Body() dto: CreateReviewDto) {
    return this.reviewsService.submit(reviewerId, dto);
  }

  @Get('target/:targetId')
  @ApiOperation({ summary: 'List reviews for a target (dietitian or recipe)' })
  @ApiQuery({ name: 'targetType', enum: ReviewTargetType })
  listByTarget(
    @Param('targetId') targetId: string,
    @Query('targetType') targetType: ReviewTargetType,
    @Query() pagination: PaginationDto,
  ) {
    return this.reviewsService.listByTarget(targetId, targetType, pagination);
  }

  @Get('mine')
  @ApiOperation({ summary: 'Get my submitted reviews' })
  listMine(@CurrentUser('id') reviewerId: string, @Query() pagination: PaginationDto) {
    return this.reviewsService.listByReviewer(reviewerId, pagination);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete a review' })
  remove(@Param('id') id: string) {
    return this.reviewsService.remove(id);
  }
}
