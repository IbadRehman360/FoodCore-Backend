import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { promises as fs } from 'fs';
import { join, extname } from 'path';
import { IStorageService } from './storage.interface';

@Injectable()
export class LocalStorageService implements IStorageService {
  private readonly rootDir: string;

  constructor(config?: ConfigService) {
    this.rootDir = config?.get<string>('UPLOADS_DIR') || join(process.cwd(), 'uploads');
  }

  async savePhoto(file: Express.Multer.File): Promise<string> {
    const filename = `${Date.now()}${extname(file.originalname)}`;
    const dir = join(this.rootDir, 'photos');
    await fs.mkdir(dir, { recursive: true });
    await fs.writeFile(join(dir, filename), file.buffer);
    return `/uploads/photos/${filename}`;
  }

  async saveCertificate(file: Express.Multer.File): Promise<string> {
    const filename = `${Date.now()}-${Math.random().toString(36).slice(2)}${extname(file.originalname)}`;
    const dir = join(this.rootDir, 'certificates');
    await fs.mkdir(dir, { recursive: true });
    await fs.writeFile(join(dir, filename), file.buffer);
    return `/uploads/certificates/${filename}`;
  }

  async deleteByUrl(url: string): Promise<void> {
    if (!url.startsWith('/uploads/')) return;
    const relative = url.replace(/^\/uploads\//, '');
    const filePath = join(this.rootDir, relative);
    await fs.unlink(filePath).catch(() => undefined);
  }
}
