import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import {
  S3Client,
  PutObjectCommand,
  DeleteObjectCommand,
} from '@aws-sdk/client-s3';
import { extname } from 'path';
import { IStorageService } from './storage.interface';

@Injectable()
export class S3StorageService implements IStorageService {
  private readonly logger = new Logger(S3StorageService.name);
  private readonly client: S3Client;
  private readonly bucket: string;
  private readonly region: string;

  constructor(private readonly config: ConfigService) {
    this.region = config.get<string>('AWS_REGION', 'us-east-1');
    this.bucket = config.get<string>('AWS_S3_BUCKET', 'food-cure-bucket');
    this.client = new S3Client({
      region: this.region,
      credentials: {
        accessKeyId: config.get<string>('AWS_ACCESS_KEY_ID', ''),
        secretAccessKey: config.get<string>('AWS_SECRET_ACCESS_KEY', ''),
      },
    });
  }

  async savePhoto(file: Express.Multer.File): Promise<string> {
    const key = `photos/${Date.now()}${extname(file.originalname)}`;
    await this.upload(key, file.buffer, file.mimetype);
    return this.publicUrl(key);
  }

  async saveCertificate(file: Express.Multer.File): Promise<string> {
    const key = `certificates/${Date.now()}-${Math.random().toString(36).slice(2)}${extname(file.originalname)}`;
    await this.upload(key, file.buffer, file.mimetype);
    return this.publicUrl(key);
  }

  async deleteByUrl(url: string): Promise<void> {
    const prefix = `https://${this.bucket}.s3.${this.region}.amazonaws.com/`;
    if (!url.startsWith(prefix)) return;
    const key = url.slice(prefix.length);
    await this.client
      .send(new DeleteObjectCommand({ Bucket: this.bucket, Key: key }))
      .catch((err) => this.logger.warn(`S3 delete failed: ${err.message}`));
  }

  private async upload(key: string, body: Buffer, contentType: string): Promise<void> {
    await this.client.send(
      new PutObjectCommand({
        Bucket: this.bucket,
        Key: key,
        Body: body,
        ContentType: contentType,
      }),
    );
  }

  private publicUrl(key: string): string {
    return `https://${this.bucket}.s3.${this.region}.amazonaws.com/${key}`;
  }
}
