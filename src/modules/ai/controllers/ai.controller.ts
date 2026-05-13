import { Body, Controller, Get, HttpCode, HttpStatus, Post } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { AiService } from '../services/ai.service';
import { FoodRecognitionDto } from '../dto/food-recognition.dto';
import { ChatbotDto } from '../dto/chatbot.dto';
import { BarcodeScanDto } from '../dto/barcode-scan.dto';
import { CurrentUser } from '@common/decorators';

@ApiTags('AI')
@ApiBearerAuth()
@Controller('ai')
export class AiController {
  constructor(private readonly aiService: AiService) {}

  @Post('food-recognition')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Recognize food from image and return nutrition data' })
  recognizeFood(@Body() dto: FoodRecognitionDto) {
    return this.aiService.recognizeFood(dto);
  }

  @Post('chatbot')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Chat with the AI nutrition assistant' })
  chat(@CurrentUser('id') userId: string, @Body() dto: ChatbotDto) {
    return this.aiService.chat(userId, dto);
  }

  @Get('recommendations')
  @ApiOperation({ summary: 'Get personalized nutrition recommendations' })
  getRecommendations(@CurrentUser('id') userId: string) {
    return this.aiService.getRecommendations(userId);
  }

  @Post('barcode-scan')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Look up nutritional info by barcode' })
  scanBarcode(@Body() dto: BarcodeScanDto) {
    return this.aiService.scanBarcode(dto);
  }
}
