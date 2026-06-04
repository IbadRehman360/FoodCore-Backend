import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { ILike, Repository } from 'typeorm';
import { Podcast, PodcastStatus } from '../entities/podcast.entity';

@Injectable()
export class PodcastsRepository {
  constructor(@InjectRepository(Podcast) private readonly repo: Repository<Podcast>) {}

  create(data: Partial<Podcast>) {
    return this.repo.save(this.repo.create(data));
  }

  findById(id: string) {
    return this.repo.findOne({ where: { id }, relations: ['host'] });
  }

  findLive(skip: number, take: number, search?: string) {
    const where: any = { status: PodcastStatus.LIVE };
    if (search) where.title = ILike(`%${search}%`);
    return this.repo.findAndCount({
      where,
      skip,
      take,
      relations: ['host'],
      order: { startedAt: 'DESC' },
    });
  }

  update(id: string, data: Partial<Podcast>) {
    return this.repo.update(id, data);
  }

  incrementViewers(id: string, delta: number) {
    return this.repo.increment({ id }, 'viewerCount', delta);
  }

  decrementViewers(id: string) {
    return this.repo
      .createQueryBuilder()
      .update(Podcast)
      .set({ viewerCount: () => 'GREATEST("viewerCount" - 1, 0)' })
      .where('id = :id', { id })
      .execute();
  }
}
