import { Body, Controller, Delete, Get, Param, Post, Query } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { ReviewsService } from '../services/reviews.service';
import { CreateReviewDto } from '../dto/create-review.dto';
import { ListReviewsDto } from '../dto/list-reviews.dto';
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
  listByTarget(
    @Param('targetId') targetId: string,
    @Query() query: ListReviewsDto,
  ) {
    const { targetType, ...pagination } = query;
    return this.reviewsService.listByTarget(targetId, targetType, pagination as any);
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
