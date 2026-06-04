import { BadRequestException, ForbiddenException, Inject, Injectable, NotFoundException } from '@nestjs/common';
import { CommunitiesRepository } from '../repositories/communities.repository';
import { CreateCommunityDto } from '../dto/create-community.dto';
import { UpdateCommunityDto } from '../dto/update-community.dto';
import { CreatePostDto } from '../dto/create-post.dto';
import { PaginationDto } from '@common/dto';
import { paginate, paginationOffset } from '@common/utils';
import { STORAGE_SERVICE, IStorageService } from '@modules/storage/storage.interface';

@Injectable()
export class CommunitiesService {
  constructor(
    private readonly repo: CommunitiesRepository,
    @Inject(STORAGE_SERVICE) private readonly storage: IStorageService,
  ) {}

  async create(creatorId: string, dto: CreateCommunityDto) {
    const community = await this.repo.create({ ...dto, createdById: creatorId });
    await this.repo.addMember(community.id, creatorId);
    return this.enrichOne(community.id);
  }

  async findAll(pagination: PaginationDto, search: string | undefined, viewerId: string) {
    const { page, limit } = pagination;
    const { skip, take } = paginationOffset(page, limit);
    const [items, total] = await this.repo.findAll(skip, take, search);
    const enriched = await this.enrichMany(items, viewerId);
    return paginate(enriched, total, page, limit);
  }

  async findJoined(pagination: PaginationDto, viewerId: string) {
    const { page, limit } = pagination;
    const ids = await this.repo.findCommunityIdsForUser(viewerId);
    if (ids.length === 0) return paginate([], 0, page, limit);
    const all = await this.repo.findByIds(ids);
    const start = (page - 1) * limit;
    const slice = all.slice(start, start + limit);
    const enriched = await this.enrichMany(slice, viewerId);
    return paginate(enriched, all.length, page, limit);
  }

  async findCreatedByMe(pagination: PaginationDto, viewerId: string) {
    const { page, limit } = pagination;
    const { skip, take } = paginationOffset(page, limit);
    const [items, total] = await this.repo.findByCreator(viewerId, skip, take);
    const enriched = await this.enrichMany(items, viewerId);
    return paginate(enriched, total, page, limit);
  }

  async findOne(id: string, viewerId: string) {
    const community = await this.repo.findById(id);
    if (!community) throw new NotFoundException('Community not found');
    const memberCount = await this.repo.countMembers(id);
    const member = await this.repo.findMember(id, viewerId);
    const postCounts = await this.repo.countPostsForMany([id]);
    return {
      ...community,
      memberCount,
      postCount: postCounts.get(id) ?? 0,
      isJoined: !!member,
      isOwner: community.createdById === viewerId,
    };
  }

  async update(id: string, userId: string, dto: UpdateCommunityDto) {
    const community = await this.repo.findById(id);
    if (!community) throw new NotFoundException('Community not found');
    if (community.createdById !== userId) throw new ForbiddenException('Only the creator can edit this community');
    await this.repo.update(id, dto);
    return this.findOne(id, userId);
  }

  async remove(id: string, userId: string) {
    const community = await this.repo.findById(id);
    if (!community) throw new NotFoundException('Community not found');
    if (community.createdById !== userId) throw new ForbiddenException('Only the creator can delete this community');
    await this.repo.delete(id);
    return { message: 'Community deleted.' };
  }

  async uploadImage(id: string, userId: string, file: Express.Multer.File) {
    const community = await this.repo.findById(id);
    if (!community) throw new NotFoundException('Community not found');
    if (community.createdById !== userId) throw new ForbiddenException('Only the creator can change the image');
    const url = await this.storage.savePhoto(file);
    await this.repo.update(id, { imageUrl: url });
    return this.findOne(id, userId);
  }

  async join(id: string, userId: string) {
    const community = await this.repo.findById(id);
    if (!community) throw new NotFoundException('Community not found');
    const existing = await this.repo.findMember(id, userId);
    if (existing) return { message: 'Already a member.' };
    await this.repo.addMember(id, userId);
    return { message: 'Joined community.' };
  }

  async leave(id: string, userId: string) {
    const community = await this.repo.findById(id);
    if (!community) throw new NotFoundException('Community not found');
    if (community.createdById === userId) throw new BadRequestException('Creator cannot leave their own community.');
    await this.repo.removeMember(id, userId);
    return { message: 'Left community.' };
  }

  async listMembers(communityId: string, pagination: PaginationDto) {
    const { page, limit } = pagination;
    const { skip, take } = paginationOffset(page, limit);
    const [items, total] = await this.repo.findMembersForCommunity(communityId, skip, take);
    return paginate(items, total, page, limit);
  }

  async removeMember(communityId: string, requesterId: string, memberUserId: string) {
    const community = await this.repo.findById(communityId);
    if (!community) throw new NotFoundException('Community not found');
    if (community.createdById !== requesterId) {
      throw new ForbiddenException('Only the creator can remove members');
    }
    if (memberUserId === community.createdById) {
      throw new BadRequestException('The creator cannot be removed from the community.');
    }
    const member = await this.repo.findMember(communityId, memberUserId);
    if (!member) throw new NotFoundException('Member not found');
    await this.repo.removeMember(communityId, memberUserId);
    return { message: 'Member removed.' };
  }

  // ─── Posts ──────────────────────────────────────────────────────────────────
  async addPost(communityId: string, userId: string, dto: CreatePostDto) {
    const community = await this.repo.findById(communityId);
    if (!community) throw new NotFoundException('Community not found');
    const isMember = await this.repo.findMember(communityId, userId);
    if (!isMember) throw new ForbiddenException('Join the community to post.');
    if (dto.parentPostId) {
      const parent = await this.repo.findPostById(dto.parentPostId);
      if (!parent || parent.communityId !== communityId) throw new BadRequestException('Invalid parent post');
    }
    return this.repo.createPost({
      communityId,
      authorId: userId,
      content: dto.content,
      parentPostId: dto.parentPostId ?? null,
    });
  }

  async listPosts(communityId: string, pagination: PaginationDto) {
    const { page, limit } = pagination;
    const { skip, take } = paginationOffset(page, limit);
    const [items, total] = await this.repo.findPostsForCommunity(communityId, skip, take);
    return paginate(items, total, page, limit);
  }

  async deletePost(communityId: string, postId: string, userId: string) {
    const post = await this.repo.findPostById(postId);
    if (!post || post.communityId !== communityId) throw new NotFoundException('Post not found');
    const community = await this.repo.findById(communityId);
    if (post.authorId !== userId && community?.createdById !== userId) {
      throw new ForbiddenException('You can only delete your own post.');
    }
    await this.repo.deletePost(postId);
    return { message: 'Post deleted.' };
  }

  // ─── Helpers ────────────────────────────────────────────────────────────────
  private async enrichOne(id: string) {
    const c = await this.repo.findById(id);
    if (!c) throw new NotFoundException('Community not found');
    const memberCount = await this.repo.countMembers(id);
    const postCounts = await this.repo.countPostsForMany([id]);
    return { ...c, memberCount, postCount: postCounts.get(id) ?? 0 };
  }

  private async enrichMany(items: any[], viewerId: string) {
    if (items.length === 0) return [];
    const ids = items.map((c) => c.id);
    const [memberCounts, postCounts, viewerMemberships] = await Promise.all([
      this.repo.countMembersForMany(ids),
      this.repo.countPostsForMany(ids),
      this.repo.findCommunityIdsForUser(viewerId),
    ]);
    const viewerSet = new Set(viewerMemberships);
    return items.map((c) => ({
      ...c,
      memberCount: memberCounts.get(c.id) ?? 0,
      postCount: postCounts.get(c.id) ?? 0,
      isJoined: viewerSet.has(c.id),
      isOwner: c.createdById === viewerId,
    }));
  }
}
