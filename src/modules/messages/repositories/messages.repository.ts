import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Brackets, Repository } from 'typeorm';
import { Conversation } from '../entities/conversation.entity';
import { Message } from '../entities/message.entity';

@Injectable()
export class MessagesRepository {
  constructor(
    @InjectRepository(Conversation) private readonly convoRepo: Repository<Conversation>,
    @InjectRepository(Message) private readonly messageRepo: Repository<Message>,
  ) {}

  findConversationByPair(a: string, b: string) {
    return this.convoRepo.findOne({ where: { participantA: a, participantB: b } });
  }

  findConversationById(id: string) {
    return this.convoRepo.findOne({ where: { id } });
  }

  createConversation(data: Partial<Conversation>) {
    return this.convoRepo.save(this.convoRepo.create(data));
  }

  updateConversation(id: string, data: Partial<Conversation>) {
    return this.convoRepo.update(id, data);
  }

  findConversationsForUser(userId: string, skip: number, take: number) {
    return this.convoRepo
      .createQueryBuilder('c')
      .where(
        new Brackets((qb) => {
          qb.where('c.participantA = :userId', { userId }).orWhere('c.participantB = :userId', { userId });
        }),
      )
      .orderBy('c.lastMessageAt', 'DESC', 'NULLS LAST')
      .skip(skip)
      .take(take)
      .getManyAndCount();
  }

  createMessage(data: Partial<Message>) {
    return this.messageRepo.save(this.messageRepo.create(data));
  }

  findMessages(conversationId: string, skip: number, take: number) {
    return this.messageRepo.findAndCount({
      where: { conversationId },
      skip,
      take,
      order: { createdAt: 'DESC' },
    });
  }
}
