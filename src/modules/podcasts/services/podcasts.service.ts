import { ForbiddenException, Injectable, NotFoundException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { randomUUID } from 'crypto';
import { RtcRole, RtcTokenBuilder, RtmTokenBuilder } from 'agora-token';
import { PodcastsRepository } from '../repositories/podcasts.repository';
import { CreatePodcastDto } from '../dto/create-podcast.dto';
import { Podcast, PodcastStatus } from '../entities/podcast.entity';
import { PaginationDto } from '@common/dto';
import { paginate, paginationOffset } from '@common/utils';

const TOKEN_TTL_SECONDS = 60 * 60 * 4; // 4 hours

@Injectable()
export class PodcastsService {
  constructor(
    private readonly repo: PodcastsRepository,
    private readonly config: ConfigService,
  ) {}

  async goLive(hostId: string, dto: CreatePodcastDto) {
    const channelName = `podcast_${randomUUID().replace(/-/g, '')}`;
    const podcast = await this.repo.create({
      hostId,
      title: dto.title,
      thumbnailUrl: dto.thumbnailUrl,
      channelName,
      status: PodcastStatus.LIVE,
      startedAt: new Date(),
      viewerCount: 0,
    });
    const enriched = await this.findOne(podcast.id);
    return {
      ...enriched,
      ...this.buildToken(channelName, RtcRole.PUBLISHER),
      rtmToken: this.buildRtmToken(hostId),
      rtmUserId: hostId,
    };
  }

  getConfig() {
    const appId = this.config.get<string>('AGORA_APP_ID') ?? '';
    const appCertificate = this.config.get<string>('AGORA_APP_CERTIFICATE') ?? '';
    const configured =
      !!appId && appId !== 'placeholder' && !!appCertificate && appCertificate !== 'placeholder';
    return { appId, agoraConfigured: configured };
  }

  async listLive(pagination: PaginationDto, search?: string) {
    const { page, limit } = pagination;
    const { skip, take } = paginationOffset(page, limit);
    const [items, total] = await this.repo.findLive(skip, take, search);
    return paginate(items.map((p) => this.shape(p)), total, page, limit);
  }

  async findOne(id: string) {
    const p = await this.repo.findById(id);
    if (!p) throw new NotFoundException('Podcast not found');
    return this.shape(p);
  }

  async getToken(id: string, userId: string, role: 'host' | 'audience') {
    const p = await this.repo.findById(id);
    if (!p) throw new NotFoundException('Podcast not found');
    if (p.status !== PodcastStatus.LIVE) throw new ForbiddenException('This podcast has ended.');
    if (role === 'host' && p.hostId !== userId) {
      throw new ForbiddenException('Only the host can broadcast this podcast.');
    }
    const rtcRole = role === 'host' ? RtcRole.PUBLISHER : RtcRole.SUBSCRIBER;
    return {
      channelName: p.channelName,
      ...this.buildToken(p.channelName, rtcRole),
      rtmToken: this.buildRtmToken(userId),
      rtmUserId: userId,
    };
  }

  async join(id: string, _userId: string) {
    const p = await this.repo.findById(id);
    if (!p) throw new NotFoundException('Podcast not found');
    await this.repo.incrementViewers(id, 1);
    return { message: 'Joined.' };
  }

  async leave(id: string, _userId: string) {
    await this.repo.decrementViewers(id);
    return { message: 'Left.' };
  }

  async end(id: string, hostId: string) {
    const p = await this.repo.findById(id);
    if (!p) throw new NotFoundException('Podcast not found');
    if (p.hostId !== hostId) throw new ForbiddenException('Only the host can end this podcast.');
    await this.repo.update(id, { status: PodcastStatus.ENDED, endedAt: new Date(), viewerCount: 0 });
    return { message: 'Podcast ended.' };
  }

  // ─── Helpers ──────────────────────────────────────────────────────────────
  private buildToken(channelName: string, role: number) {
    const appId = this.config.get<string>('AGORA_APP_ID') ?? '';
    const appCertificate = this.config.get<string>('AGORA_APP_CERTIFICATE') ?? '';
    // uid 0 → the token is valid for any uid that joins this channel (dev-friendly).
    const token = RtcTokenBuilder.buildTokenWithUid(
      appId, appCertificate, channelName, 0, role, TOKEN_TTL_SECONDS, TOKEN_TTL_SECONDS,
    );
    const configured =
      !!appId && appId !== 'placeholder' && !!appCertificate && appCertificate !== 'placeholder';
    return { appId, token, uid: 0, agoraConfigured: configured };
  }

  private buildRtmToken(userId: string) {
    const appId = this.config.get<string>('AGORA_APP_ID') ?? '';
    const appCertificate = this.config.get<string>('AGORA_APP_CERTIFICATE') ?? '';
    if (!appId || appId === 'placeholder' || !appCertificate || appCertificate === 'placeholder') {
      return '';
    }
    return RtmTokenBuilder.buildToken(appId, appCertificate, userId, TOKEN_TTL_SECONDS);
  }

  private shape(p: Podcast) {
    return {
      id: p.id,
      title: p.title ?? p.host?.fullName ?? 'Live Podcast',
      channelName: p.channelName,
      thumbnailUrl: p.thumbnailUrl ?? null,
      status: p.status,
      viewerCount: Math.max(0, p.viewerCount ?? 0),
      startedAt: p.startedAt,
      endedAt: p.endedAt,
      hostId: p.hostId,
      host: p.host
        ? { id: p.host.id, fullName: p.host.fullName, profilePhoto: p.host.profilePhoto, role: p.host.role }
        : null,
    };
  }
}
