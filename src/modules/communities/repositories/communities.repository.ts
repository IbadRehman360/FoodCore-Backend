import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { ILike, In, Repository } from 'typeorm';
import { Community } from '../entities/community.entity';
import { CommunityMember } from '../entities/community-member.entity';
import { CommunityPost } from '../entities/community-post.entity';

@Injectable()
export class CommunitiesRepository {
  constructor(
    @InjectRepository(Community) private readonly repo: Repository<Community>,
    @InjectRepository(CommunityMember) private readonly memberRepo: Repository<CommunityMember>,
    @InjectRepository(CommunityPost) private readonly postRepo: Repository<CommunityPost>,
  ) {}

  create(data: Partial<Community>) {
    return this.repo.save(this.repo.create(data));
  }

  findById(id: string) {
    return this.repo.findOne({ where: { id }, relations: ['createdBy'] });
  }

  findAll(skip: number, take: number, search?: string) {
    const where: any = search ? { name: ILike(`%${search}%`) } : {};
    return this.repo.findAndCount({ where, skip, take, relations: ['createdBy'], order: { createdAt: 'DESC' } });
  }

  findByIds(ids: string[]) {
    if (ids.length === 0) return Promise.resolve([] as Community[]);
    return this.repo.find({ where: { id: In(ids) }, relations: ['createdBy'] });
  }

  findByCreator(userId: string, skip: number, take: number) {
    return this.repo.findAndCount({
      where: { createdById: userId },
      skip, take, relations: ['createdBy'], order: { createdAt: 'DESC' },
    });
  }

  update(id: string, data: Partial<Community>) {
    return this.repo.update(id, data);
  }

  delete(id: string) {
    return this.repo.softDelete(id);
  }

  // ─── Members ────────────────────────────────────────────────────────────────
  countMembers(communityId: string) {
    return this.memberRepo.count({ where: { communityId } });
  }

  countMembersForMany(communityIds: string[]) {
    if (communityIds.length === 0) return Promise.resolve(new Map<string, number>());
    return this.memberRepo.createQueryBuilder('m')
      .select('m.communityId', 'id')
      .addSelect('COUNT(*)', 'count')
      .where('m.communityId IN (:...ids)', { ids: communityIds })
      .groupBy('m.communityId')
      .getRawMany<{ id: string; count: string }>()
      .then((rows) => new Map(rows.map((r) => [r.id, parseInt(r.count, 10) || 0])));
  }

  countPostsForMany(communityIds: string[]) {
    if (communityIds.length === 0) return Promise.resolve(new Map<string, number>());
    return this.postRepo.createQueryBuilder('p')
      .select('p.communityId', 'id')
      .addSelect('COUNT(*)', 'count')
      .where('p.communityId IN (:...ids)', { ids: communityIds })
      .groupBy('p.communityId')
      .getRawMany<{ id: string; count: string }>()
      .then((rows) => new Map(rows.map((r) => [r.id, parseInt(r.count, 10) || 0])));
  }

  findMember(communityId: string, userId: string) {
    return this.memberRepo.findOne({ where: { communityId, userId } });
  }

  addMember(communityId: string, userId: string) {
    return this.memberRepo.save(this.memberRepo.create({ communityId, userId }));
  }

  removeMember(communityId: string, userId: string) {
    return this.memberRepo.delete({ communityId, userId });
  }

  findCommunityIdsForUser(userId: string) {
    return this.memberRepo.find({ where: { userId }, select: { communityId: true } })
      .then((rows) => rows.map((r) => r.communityId));
  }

  findMembersForCommunity(communityId: string, skip: number, take: number) {
    return this.memberRepo.findAndCount({
      where: { communityId },
      skip, take, relations: ['user'], order: { createdAt: 'ASC' },
    });
  }

  // ─── Posts ──────────────────────────────────────────────────────────────────
  createPost(data: Partial<CommunityPost>) {
    return this.postRepo.save(this.postRepo.create(data));
  }

  findPostById(id: string) {
    return this.postRepo.findOne({ where: { id }, relations: ['author'] });
  }

  findPostsForCommunity(communityId: string, skip: number, take: number) {
    return this.postRepo.findAndCount({
      where: { communityId },
      skip, take, relations: ['author'], order: { createdAt: 'ASC' },
    });
  }

  deletePost(id: string) {
    return this.postRepo.softDelete(id);
  }
}
