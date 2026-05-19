import {
  Body, Controller, Get, HttpCode, HttpStatus, Patch, Post,
  UploadedFile, UploadedFiles, UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor, FilesInterceptor } from '@nestjs/platform-express';
import { ApiBearerAuth, ApiBody, ApiConsumes, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { diskStorage } from 'multer';
import { extname } from 'path';
import { DietitiansService } from '../services/dietitians.service';
import { UsersService } from '@modules/users/services/users.service';
import { UpdateDietitianDto } from '../dto/update-dietitian.dto';
import { SetupBasicProfileDto } from '../dto/setup-basic-profile.dto';
import { SetupProfessionalProfileDto } from '../dto/setup-professional-profile.dto';
import { SetupAvailabilityDto } from '../dto/setup-availability.dto';
import { ChangePasswordDto } from '@modules/users/dto/change-password.dto';
import { CurrentUser, Roles } from '@common/decorators';
import { Role } from '@common/enums';

const photoStorage = diskStorage({
  destination: './uploads/photos',
  filename: (_, file, cb) => cb(null, `${Date.now()}${extname(file.originalname)}`),
});

const certificateStorage = diskStorage({
  destination: './uploads/certificates',
  filename: (_, file, cb) => cb(null, `${Date.now()}${extname(file.originalname)}`),
});

@ApiTags('Consultant Profile')
@ApiBearerAuth()
@Roles(Role.DIETITIAN)
@Controller('dietitians')
export class ConsultantProfileController {
  constructor(
    private readonly dietitiansService: DietitiansService,
    private readonly usersService: UsersService,
  ) {}

  @Get('me')
  @ApiOperation({ summary: 'Get my consultant profile' })
  @ApiResponse({ status: 200, description: 'Consultant profile with user details' })
  getMyProfile(@CurrentUser('id') userId: string) {
    return this.dietitiansService.findByUserId(userId);
  }

  @Patch('me')
  @ApiOperation({ summary: 'Update general consultant fields — occupation, bio, timezone' })
  @ApiResponse({ status: 200, description: 'Profile updated' })
  updateProfile(@CurrentUser('id') userId: string, @Body() dto: UpdateDietitianDto) {
    return this.dietitiansService.findByUserId(userId).then(d => this.dietitiansService.updateProfile(d.id, dto));
  }

  @Patch('me/basic-profile')
  @ApiOperation({ summary: 'Edit basic profile — name, DOB, country, city, state, phone' })
  @ApiResponse({ status: 200, description: 'Basic profile saved' })
  setupBasicProfile(@CurrentUser('id') userId: string, @Body() dto: SetupBasicProfileDto) {
    return this.dietitiansService.setupBasicProfile(userId, dto);
  }

  @Patch('me/professional-profile')
  @ApiOperation({ summary: 'Edit professional profile — occupation, services, bio, social links, session fees' })
  @ApiResponse({ status: 200, description: 'Professional profile saved' })
  setupProfessionalProfile(@CurrentUser('id') userId: string, @Body() dto: SetupProfessionalProfileDto) {
    return this.dietitiansService.setupProfessionalProfile(userId, dto);
  }

  @Post('me/certificates')
  @HttpCode(HttpStatus.OK)
  @UseInterceptors(FilesInterceptor('files', 10, { storage: certificateStorage }))
  @ApiConsumes('multipart/form-data')
  @ApiBody({ schema: { type: 'object', properties: { files: { type: 'array', items: { type: 'string', format: 'binary' } } } } })
  @ApiOperation({ summary: 'Upload certification documents — max 10 files (images/PDF)' })
  @ApiResponse({ status: 200, description: 'Certificates uploaded' })
  uploadCertificates(@CurrentUser('id') userId: string, @UploadedFiles() files: Express.Multer.File[]) {
    const urls = files.map(f => `/uploads/certificates/${f.filename}`);
    return this.dietitiansService.addCertificates(userId, urls);
  }

  @Patch('me/availability')
  @ApiOperation({ summary: 'Set weekly availability — timezone + per-day time slots' })
  @ApiResponse({ status: 200, description: 'Availability saved' })
  setupAvailability(@CurrentUser('id') userId: string, @Body() dto: SetupAvailabilityDto) {
    return this.dietitiansService.setupAvailability(userId, dto);
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
  @UseInterceptors(FileInterceptor('photo', { storage: photoStorage }))
  @ApiConsumes('multipart/form-data')
  @ApiBody({ schema: { type: 'object', properties: { photo: { type: 'string', format: 'binary' } } } })
  @ApiOperation({ summary: 'Upload profile photo' })
  @ApiResponse({ status: 200, description: 'Profile photo updated' })
  uploadPhoto(@CurrentUser('id') userId: string, @UploadedFile() file: Express.Multer.File) {
    return this.usersService.updateProfilePhoto(userId, `/uploads/photos/${file.filename}`);
  }
}
