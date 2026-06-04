import {
  Body, Controller, Delete, Get, HttpCode, HttpStatus, Param, Patch, Post, Query,
  UploadedFile, UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { memoryStorage } from 'multer';
import { ApiBearerAuth, ApiBody, ApiConsumes, ApiOperation, ApiTags } from '@nestjs/swagger';
import { CommunitiesService } from '../services/communities.service';
import { CreateCommunityDto } from '../dto/create-community.dto';
import { UpdateCommunityDto } from '../dto/update-community.dto';
import { CreatePostDto } from '../dto/create-post.dto';
import { CurrentUser, Roles } from '@common/decorators';
import { Role } from '@common/enums';
import { PaginationDto } from '@common/dto';

@ApiTags('Communities')
@ApiBearerAuth()
@Controller('communities')
export class CommunitiesController {
  constructor(private readonly service: CommunitiesService) {}

  @Post()
  @Roles(Role.DIETITIAN)
  @ApiOperation({ summary: 'Create a new community (consultants only)' })
  create(@CurrentUser('id') userId: string, @Body() dto: CreateCommunityDto) {
    return this.service.create(userId, dto);
  }

  @Get()
  @ApiOperation({ summary: 'List all communities (optional ?search=)' })
  findAll(
    @CurrentUser('id') userId: string,
    @Query() pagination: PaginationDto,
    @Query('search') search?: string,
  ) {
    return this.service.findAll(pagination, search, userId);
  }

  @Get('joined')
  @ApiOperation({ summary: 'List communities I have joined' })
  findJoined(@CurrentUser('id') userId: string, @Query() pagination: PaginationDto) {
    return this.service.findJoined(pagination, userId);
  }

  @Get('mine')
  @ApiOperation({ summary: 'List communities I created' })
  findMine(@CurrentUser('id') userId: string, @Query() pagination: PaginationDto) {
    return this.service.findCreatedByMe(pagination, userId);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get community details (creator, member count, post count, join state)' })
  findOne(@Param('id') id: string, @CurrentUser('id') userId: string) {
    return this.service.findOne(id, userId);
  }

  @Patch(':id')
  @Roles(Role.DIETITIAN)
  @ApiOperation({ summary: 'Update community (creator only)' })
  update(@Param('id') id: string, @CurrentUser('id') userId: string, @Body() dto: UpdateCommunityDto) {
    return this.service.update(id, userId, dto);
  }

  @Delete(':id')
  @Roles(Role.DIETITIAN)
  @ApiOperation({ summary: 'Delete community (creator only)' })
  remove(@Param('id') id: string, @CurrentUser('id') userId: string) {
    return this.service.remove(id, userId);
  }

  @Post(':id/image')
  @ApiConsumes('multipart/form-data')
  @ApiBody({ schema: { type: 'object', properties: { image: { type: 'string', format: 'binary' } } } })
  @UseInterceptors(FileInterceptor('image', { storage: memoryStorage() }))
  @Roles(Role.DIETITIAN)
  @ApiOperation({ summary: 'Upload community cover image (creator only)' })
  uploadImage(@Param('id') id: string, @CurrentUser('id') userId: string, @UploadedFile() file: Express.Multer.File) {
    return this.service.uploadImage(id, userId, file);
  }

  @Post(':id/join')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Join a community' })
  join(@Param('id') id: string, @CurrentUser('id') userId: string) {
    return this.service.join(id, userId);
  }

  @Delete(':id/leave')
  @ApiOperation({ summary: 'Leave a community' })
  leave(@Param('id') id: string, @CurrentUser('id') userId: string) {
    return this.service.leave(id, userId);
  }

  @Get(':id/members')
  @ApiOperation({ summary: 'List community members' })
  members(@Param('id') id: string, @Query() pagination: PaginationDto) {
    return this.service.listMembers(id, pagination);
  }

  @Delete(':id/members/:userId')
  @Roles(Role.DIETITIAN)
  @ApiOperation({ summary: 'Remove a member from a community (creator only)' })
  removeMember(
    @Param('id') id: string,
    @Param('userId') userId: string,
    @CurrentUser('id') requesterId: string,
  ) {
    return this.service.removeMember(id, requesterId, userId);
  }

  // ─── Posts ──────────────────────────────────────────────────────────────────
  @Post(':id/posts')
  @ApiOperation({ summary: 'Create a post or reply in a community' })
  addPost(@Param('id') id: string, @CurrentUser('id') userId: string, @Body() dto: CreatePostDto) {
    return this.service.addPost(id, userId, dto);
  }

  @Get(':id/posts')
  @ApiOperation({ summary: 'List posts and replies for a community' })
  listPosts(@Param('id') id: string, @Query() pagination: PaginationDto) {
    return this.service.listPosts(id, pagination);
  }

  @Delete(':id/posts/:postId')
  @ApiOperation({ summary: 'Delete a post (author or community creator only)' })
  deletePost(@Param('id') id: string, @Param('postId') postId: string, @CurrentUser('id') userId: string) {
    return this.service.deletePost(id, postId, userId);
  }
}
