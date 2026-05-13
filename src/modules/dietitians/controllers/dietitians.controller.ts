import {
  Body, Controller, Get, HttpCode, HttpStatus, Param, Patch, Post,
  Query, UploadedFiles, UseInterceptors,
} from '@nestjs/common';
import { FilesInterceptor } from '@nestjs/platform-express';
import { ApiBearerAuth, ApiConsumes, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { diskStorage } from 'multer';
import { extname } from 'path';
import { DietitiansService } from '../services/dietitians.service';
import { UpdateDietitianDto } from '../dto/update-dietitian.dto';
import { SetupBasicProfileDto } from '../dto/setup-basic-profile.dto';
import { SetupProfessionalProfileDto } from '../dto/setup-professional-profile.dto';
import { SetupAvailabilityDto } from '../dto/setup-availability.dto';
import { CurrentUser, Roles } from '@common/decorators';
import { Role } from '@common/enums';
import { PaginationDto } from '@common/dto';

const certificateStorage = diskStorage({
  destination: './uploads/certificates',
  filename: (_, file, cb) => cb(null, `${Date.now()}${extname(file.originalname)}`),
});

@ApiTags('Dietitians')
@ApiBearerAuth()
@Controller('dietitians')
export class DietitiansController {
  constructor(private readonly dietitiansService: DietitiansService) {}

  @Post('register')
  @ApiOperation({ summary: 'Register as a dietitian — creates profile, sets role to DIETITIAN' })
  @ApiResponse({ status: 201, description: 'Dietitian profile created; status: pending approval' })
  @ApiResponse({ status: 400, description: 'Already registered as a dietitian' })
  register(@CurrentUser('id') userId: string) {
    return this.dietitiansService.register(userId);
  }

  @Patch('me/basic-profile')
  @Roles(Role.DIETITIAN)
  @ApiOperation({ summary: 'Save basic profile — screen 1 (name, DOB, country, city, state, phone)' })
  @ApiResponse({ status: 200, description: 'Basic profile saved' })
  setupBasicProfile(@CurrentUser('id') userId: string, @Body() dto: SetupBasicProfileDto) {
    return this.dietitiansService.setupBasicProfile(userId, dto);
  }

  @Patch('me/professional-profile')
  @Roles(Role.DIETITIAN)
  @ApiOperation({ summary: 'Save professional profile — screens 2–3 (occupation, services, bio, social links, fees)' })
  @ApiResponse({ status: 200, description: 'Professional profile saved' })
  setupProfessionalProfile(@CurrentUser('id') userId: string, @Body() dto: SetupProfessionalProfileDto) {
    return this.dietitiansService.setupProfessionalProfile(userId, dto);
  }

  @Post('me/certificates')
  @Roles(Role.DIETITIAN)
  @HttpCode(HttpStatus.OK)
  @UseInterceptors(FilesInterceptor('files', 10, { storage: certificateStorage }))
  @ApiConsumes('multipart/form-data')
  @ApiOperation({ summary: 'Upload certification documents — screens 2–3 (max 10 files, images/PDF)' })
  @ApiResponse({ status: 200, description: 'Certificates uploaded and appended to profile' })
  uploadCertificates(
    @CurrentUser('id') userId: string,
    @UploadedFiles() files: Express.Multer.File[],
  ) {
    const urls = files.map(f => `/uploads/certificates/${f.filename}`);
    return this.dietitiansService.addCertificates(userId, urls);
  }

  @Patch('me/availability')
  @Roles(Role.DIETITIAN)
  @ApiOperation({ summary: 'Set weekly availability — screen 4 (timezone + per-day slots)' })
  @ApiResponse({ status: 200, description: 'Availability saved' })
  setupAvailability(@CurrentUser('id') userId: string, @Body() dto: SetupAvailabilityDto) {
    return this.dietitiansService.setupAvailability(userId, dto);
  }

  @Get('me')
  @Roles(Role.DIETITIAN)
  @ApiOperation({ summary: 'Get own dietitian profile' })
  getMyProfile(@CurrentUser('id') userId: string) {
    return this.dietitiansService.findByUserId(userId);
  }

  @Patch('me')
  @Roles(Role.DIETITIAN)
  @ApiOperation({ summary: 'Update general dietitian profile fields' })
  updateProfile(@CurrentUser('id') userId: string, @Body() dto: UpdateDietitianDto) {
    return this.dietitiansService.findByUserId(userId).then(d => this.dietitiansService.updateProfile(d.id, dto));
  }

  @Get()
  @ApiOperation({ summary: 'List all approved dietitians — public browse' })
  findAll(@Query() pagination: PaginationDto) {
    return this.dietitiansService.findApproved(pagination);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get dietitian public profile by ID' })
  findOne(@Param('id') id: string) {
    return this.dietitiansService.findOrFail(id);
  }
}
