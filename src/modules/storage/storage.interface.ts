export const STORAGE_SERVICE = 'STORAGE_SERVICE';

export interface IStorageService {
  savePhoto(file: Express.Multer.File): Promise<string>;
  saveCertificate(file: Express.Multer.File): Promise<string>;
  deleteByUrl(url: string): Promise<void>;
}
