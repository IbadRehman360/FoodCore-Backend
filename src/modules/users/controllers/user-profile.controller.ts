import {
  Body, Controller, Get, HttpCode, HttpStatus, Inject, Patch, Post,
  UploadedFile, UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { ApiBearerAuth, ApiBody, ApiConsumes, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { memoryStorage } from 'multer';
import { UsersService } from '../services/users.service';
import { SetupProfileDto } from '../dto/setup-profile.dto';
import { HealthProfileDto } from '../dto/health-profile.dto';
import { ChangePasswordDto } from '../dto/change-password.dto';
import { CurrentUser } from '@common/decorators';
import { STORAGE_SERVICE, IStorageService } from '@modules/storage/storage.interface';

@ApiTags('User Profile')
@ApiBearerAuth()
@Controller('users')
export class UserProfileController {
  constructor(
    private readonly usersService: UsersService,
    @Inject(STORAGE_SERVICE) private readonly storage: IStorageService,
  ) {}

  @Get('me')
  @ApiOperation({ summary: 'Get my profile' })
  @ApiResponse({ status: 200, description: 'Current user profile' })
  getProfile(@CurrentUser('id') userId: string) {
    return this.usersService.findOrFail(userId);
  }

  @Patch('me/profile')
  @ApiOperation({ summary: 'Edit profile — name, DOB, country, state, city, about, phone' })
  @ApiResponse({ status: 200, description: 'Profile updated' })
  updateProfile(@CurrentUser('id') userId: string, @Body() dto: SetupProfileDto) {
    return this.usersService.setupProfile(userId, dto);
  }

  @Patch('me/health')
  @ApiOperation({ summary: 'Edit health profile — goals, weight, symptoms, allergies, meal preference' })
  @ApiResponse({ status: 200, description: 'Health profile updated' })
  updateHealthProfile(@CurrentUser('id') userId: string, @Body() dto: HealthProfileDto) {
    return this.usersService.updateHealthProfile(userId, dto);
  }

  @Get('me/referral')
  @ApiOperation({ summary: 'Get referral code and shareable link' })
  @ApiResponse({ status: 200, description: 'Referral code and link' })
  getReferral(@CurrentUser('id') userId: string) {
    return this.usersService.getReferral(userId);
  }

  @Patch('me/password')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Change password — requires current password verification' })
  @ApiResponse({ status: 200, description: 'Password changed' })
  @ApiResponse({ status: 400, description: 'Current password is incorrect' })
  changePassword(@CurrentUser('id') userId: string, @Body() dto: ChangePasswordDto) {
    return this.usersService.changePassword(userId, dto);
  }

  @Post('me/photo')
  @HttpCode(HttpStatus.OK)
  @UseInterceptors(FileInterceptor('photo', { storage: memoryStorage() }))
  @ApiConsumes('multipart/form-data')
  @ApiBody({ schema: { type: 'object', properties: { photo: { type: 'string', format: 'binary' } } } })
  @ApiOperation({ summary: 'Upload profile photo' })
  @ApiResponse({ status: 200, description: 'Profile photo updated' })
  async uploadPhoto(@CurrentUser('id') userId: string, @UploadedFile() file: Express.Multer.File) {
    const url = await this.storage.savePhoto(file);
    return this.usersService.updateProfilePhoto(userId, url);
  }
}
