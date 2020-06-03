import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { StorageRepository, StorageFileRepository, StorageFolderRepository } from './storage.repository';
import { Account } from '../accounts/account.entity';
import { UploadFileDto } from './dto/upload-file.dto';

@Injectable()
export class StoragesService {
  constructor(
    @InjectRepository(StorageRepository)
    @InjectRepository(StorageFileRepository)
    @InjectRepository(StorageFolderRepository)
    private storageRepository: StorageRepository,
    private storageFileRepository: StorageFileRepository,
    private storageFolderRepository: StorageFolderRepository
  ) {}

  async saveFileToFolder(folderId: number, file: UploadFileDto, account: Account) {
    const savedFile = await this.storageFileRepository.saveFile(file, account);
    return this.storageFolderRepository.addFileToFolder(savedFile.id, folderId);
  }
}
