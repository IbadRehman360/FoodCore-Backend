import { Injectable } from '@nestjs/common';
import { promises as fs } from 'fs';
import { join, extname } from 'path';
import { IStorageService } from './storage.interface';

@Injectable()
export class LocalStorageService implements IStorageService {
  async savePhoto(file: Express.Multer.File): Promise<string> {
    const filename = `${Date.now()}${extname(file.originalname)}`;
    const dir = join(process.cwd(), 'uploads', 'photos');
    await fs.mkdir(dir, { recursive: true });
    await fs.writeFile(join(dir, filename), file.buffer);
    return `/uploads/photos/${filename}`;
  }

  async saveCertificate(file: Express.Multer.File): Promise<string> {
    const filename = `${Date.now()}-${Math.random().toString(36).slice(2)}${extname(file.originalname)}`;
    const dir = join(process.cwd(), 'uploads', 'certificates');
    await fs.mkdir(dir, { recursive: true });
    await fs.writeFile(join(dir, filename), file.buffer);
    return `/uploads/certificates/${filename}`;
  }

  async deleteByUrl(url: string): Promise<void> {
    if (!url.startsWith('/uploads/')) return;
    const filePath = join(process.cwd(), url);
    await fs.unlink(filePath).catch(() => undefined);
  }
}
