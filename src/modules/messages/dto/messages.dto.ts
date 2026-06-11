import { IsString, IsUUID, MaxLength, MinLength } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class StartConversationDto {
  @ApiProperty({ description: 'The other user to chat with' })
  @IsUUID()
  targetUserId: string;
}

export class SendMessageDto {
  @ApiProperty()
  @IsString()
  @MinLength(1)
  @MaxLength(4000)
  content: string;
}
