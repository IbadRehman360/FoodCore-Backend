import { Body, Controller, Get, Param, Post, Query } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { MessagesService } from '../services/messages.service';
import { SendMessageDto, StartConversationDto } from '../dto/messages.dto';
import { CurrentUser } from '@common/decorators';
import { PaginationDto } from '@common/dto';

@ApiTags('Messages')
@ApiBearerAuth()
@Controller('messages')
export class MessagesController {
  constructor(private readonly service: MessagesService) {}

  @Get('rtm-token')
  @ApiOperation({ summary: 'Agora RTM token for realtime chat' })
  rtmToken(@CurrentUser('id') userId: string) {
    return this.service.getRtmToken(userId);
  }

  @Get('conversations')
  @ApiOperation({ summary: 'List my conversations' })
  conversations(@CurrentUser('id') userId: string, @Query() pagination: PaginationDto) {
    return this.service.getConversations(userId, pagination);
  }

  @Post('conversations')
  @ApiOperation({ summary: 'Start (or get) a conversation with another user' })
  start(@CurrentUser('id') userId: string, @Body() dto: StartConversationDto) {
    return this.service.startConversation(userId, dto.targetUserId);
  }

  @Get('conversations/:id/messages')
  @ApiOperation({ summary: 'Get messages in a conversation' })
  messages(@Param('id') id: string, @CurrentUser('id') userId: string, @Query() pagination: PaginationDto) {
    return this.service.getMessages(id, userId, pagination);
  }

  @Post('conversations/:id')
  @ApiOperation({ summary: 'Send a message in a conversation' })
  send(@Param('id') id: string, @CurrentUser('id') userId: string, @Body() dto: SendMessageDto) {
    return this.service.sendMessage(id, userId, dto);
  }
}
