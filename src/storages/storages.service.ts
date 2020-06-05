import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import {
  StorageRepository,
  StorageFileRepository,
  StorageFolderRepository
} from './storage.repository';
import { Account } from '../accounts/account.entity';
import { UploadFileDto } from './dto/upload-file.dto';
import { CreateFolderDto } from './dto/create-folder.dto';
import { In } from 'typeorm';
import { UpdateFileDto } from './dto/update-file.dto';
import { UpdateFolderDto } from './dto/update-folder.dto';
import { FolderType } from './storage-folder.enum';

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

  async getMyStorage(account: Account) {
    const storage = await this.storageRepository.findOne({ account });
    delete storage.account.password;
    const rootFolder = await this.storageFolderRepository.findOne({
      folderType: FolderType.ROOT,
      account
    });
    console.log('[MESSAGE]: StoragesService -> getMyStorage -> account', account)

    console.log('[MESSAGE]: StoragesService -> getMyStorage -> rootFolder', rootFolder)
    return { ...storage, rootFolderId: rootFolder.id };
  }

  async saveFileToFolder(
    folderId: number,
    file: UploadFileDto,
    account: Account
  ) {
    const savedFile = await this.storageFileRepository.saveFile(file, account);
    const storage = await this.storageRepository.findOne({ account });
    await this.storageRepository.incrementStorageSize(
      storage.id,
      savedFile.size
    );
    await this.storageFolderRepository.addFileToFolder(savedFile.id, folderId);
    return savedFile;
  }

  async getFolder(folderId: number, account: Account) {
    const folder = await this.storageFolderRepository.findOne({
      id: folderId,
      account
    });
    const { childFiles, childFolders } = folder;
    let childFilesDetail: any[] = [];
    let childFoldersDetail: any[] = [];

    if (childFiles.length > 0) {
      childFilesDetail = await this.storageFileRepository.find({
        where: { id: In(childFiles) },
        order: {
          originalname: 'ASC'
        }
      });
    }
    if (childFolders.length > 0) {
      childFoldersDetail = await this.storageFolderRepository.find({
        where: { id: In(childFolders) },
        order: {
          name: 'ASC'
        }
      });
    }

    const result = {
      id: folder.id,
      folderType: folder.folderType,
      name: folder.name,
      childFiles: childFilesDetail,
      childFolders: childFoldersDetail
    };

    return result;
  }

  async createFolder(createFolderDto: CreateFolderDto, account: Account) {
    const { parentFolderId } = createFolderDto;
    const createdFolder = await this.storageFolderRepository.createFolder(
      createFolderDto,
      account
    );
    delete createdFolder.account;
    await this.storageFolderRepository.addFolderToFolder(
      parentFolderId,
      createdFolder.id
    );
    return createdFolder;
  }

  async deleteFile(folderId: number, fileId: number, account: Account) {
    const file = await this.storageFileRepository.findOne({ id: fileId });
    await this.storageFileRepository.deleteFile(fileId, account);
    const storage = await this.storageRepository.findOne({ account });
    await this.storageRepository.decrementStorageSize(storage.id, file.size);
    const updated = await this.storageFolderRepository.removeFileFromFolder(
      folderId,
      fileId
    );
    return updated;
  }

  async deleteChildFolder(
    folderId: number,
    childFolderId: number,
    account: Account
  ) {
    await this.storageFolderRepository.deleteFolder(childFolderId, account);
    const updated = await this.storageFolderRepository.removeChildFolderFromFolder(
      folderId,
      childFolderId
    );
    return updated;
  }

  async updateFile(
    updateFileDto: UpdateFileDto,
    folderId: number,
    fileId: number,
    account: Account
  ) {
    return this.storageFileRepository.updateFile(
      updateFileDto,
      fileId,
      account
    );
  }

  async updateFolder(
    updateFolderDto: UpdateFolderDto,
    folderId: number,
    childFolderId: number,
    account: Account
  ) {
    return this.storageFolderRepository.updateFolder(
      updateFolderDto,
      folderId,
      childFolderId,
      account
    );
  }
}
