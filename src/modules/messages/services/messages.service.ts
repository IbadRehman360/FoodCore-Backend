import { BadRequestException, ForbiddenException, Injectable, NotFoundException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { RtmTokenBuilder } from 'agora-token';
import { MessagesRepository } from '../repositories/messages.repository';
import { SendMessageDto } from '../dto/messages.dto';
import { PaginationDto } from '@common/dto';
import { paginate, paginationOffset } from '@common/utils';
import { UsersService } from '@modules/users/services/users.service';
import { Conversation } from '../entities/conversation.entity';

const RTM_TTL_SECONDS = 60 * 60 * 24; // 24h

@Injectable()
export class MessagesService {
  constructor(
    private readonly repo: MessagesRepository,
    private readonly usersService: UsersService,
    private readonly config: ConfigService,
  ) {}

  async startConversation(userId: string, targetUserId: string) {
    if (userId === targetUserId) throw new BadRequestException('You cannot message yourself.');
    const target = await this.usersService.findById(targetUserId).catch(() => null);
    if (!target) throw new NotFoundException('User not found');
    const [a, b] = this.sortPair(userId, targetUserId);
    let convo = await this.repo.findConversationByPair(a, b);
    convo ??= await this.repo.createConversation({ participantA: a, participantB: b });
    return this.shapeConversation(convo, userId);
  }

  async getConversations(userId: string, pagination: PaginationDto) {
    const { page, limit } = pagination;
    const { skip, take } = paginationOffset(page, limit);
    const [items, total] = await this.repo.findConversationsForUser(userId, skip, take);
    const shaped = await Promise.all(items.map((c) => this.shapeConversation(c, userId)));
    return paginate(shaped, total, page, limit);
  }

  async getMessages(conversationId: string, userId: string, pagination: PaginationDto) {
    await this.assertMember(conversationId, userId);
    const { page, limit } = pagination;
    const { skip, take } = paginationOffset(page, limit);
    const [items, total] = await this.repo.findMessages(conversationId, skip, take);
    const shaped = items.map((m) => ({
      id: m.id,
      conversationId: m.conversationId,
      senderId: m.senderId,
      content: m.content,
      createdAt: m.createdAt,
      isMine: m.senderId === userId,
    }));
    return paginate(shaped, total, page, limit);
  }

  async sendMessage(conversationId: string, userId: string, dto: SendMessageDto) {
    await this.assertMember(conversationId, userId);
    const message = await this.repo.createMessage({
      conversationId,
      senderId: userId,
      content: dto.content,
    });
    await this.repo.updateConversation(conversationId, {
      lastMessage: dto.content,
      lastMessageAt: new Date(),
    });
    return {
      id: message.id,
      conversationId,
      senderId: userId,
      content: message.content,
      createdAt: message.createdAt,
      isMine: true,
    };
  }

  /// RTM token so the client can subscribe to the conversation channel (= its id).
  getRtmToken(userId: string) {
    const appId = this.config.get<string>('AGORA_APP_ID') ?? '';
    const appCertificate = this.config.get<string>('AGORA_APP_CERTIFICATE') ?? '';
    const configured =
      !!appId && appId !== 'placeholder' && !!appCertificate && appCertificate !== 'placeholder';
    const rtmToken = configured ? RtmTokenBuilder.buildToken(appId, appCertificate, userId, RTM_TTL_SECONDS) : '';
    return { appId, rtmToken, rtmUserId: userId, agoraConfigured: configured };
  }

  // ─── Helpers ──────────────────────────────────────────────────────────────
  private async assertMember(conversationId: string, userId: string) {
    const convo = await this.repo.findConversationById(conversationId);
    if (!convo) throw new NotFoundException('Conversation not found');
    if (convo.participantA !== userId && convo.participantB !== userId) {
      throw new ForbiddenException('You are not part of this conversation.');
    }
    return convo;
  }

  private async shapeConversation(c: Conversation, userId: string) {
    const otherId = c.participantA === userId ? c.participantB : c.participantA;
    const other = await this.usersService.findById(otherId).catch(() => null);
    return {
      id: c.id,
      lastMessage: c.lastMessage ?? null,
      lastMessageAt: c.lastMessageAt ?? null,
      participant: other
        ? { id: other.id, fullName: other.fullName, profilePhoto: other.profilePhoto, role: other.role }
        : { id: otherId },
    };
  }

  private sortPair(x: string, y: string): [string, string] {
    return x < y ? [x, y] : [y, x];
  }
}
