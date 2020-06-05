import { ConflictException, NotFoundException } from '@nestjs/common';
import { EntityRepository, Repository } from 'typeorm';
import { Account } from '../accounts/account.entity';
import { UpdateApprovedStorageDto } from '../features/dto';
import { FeatureStatus } from '../features/feature.enum';
import { CreateFolderDto } from './dto/create-folder.dto';
import { UploadFileDto } from './dto/upload-file.dto';
import { UpdateFileDto } from './dto/update-file.dto';
import { StorageFile } from './storage-file.entity';
import { StorageFolder } from './storage-folder.entity';
import { FolderType } from './storage-folder.enum';
import { Storage } from './storage.entity';
import { UpdateFolderDto } from './dto/update-folder.dto';

@EntityRepository(Storage)
export class StorageRepository extends Repository<Storage> {
  async createStorage(account: Account, maxSize: number, endDate: Date) {
    const storage = new Storage();
    storage.startDate = new Date();
    storage.endDate = endDate;
    storage.maxSize = maxSize;
    storage.status = FeatureStatus.ACTIVE;
    storage.account = account;
    try {
      await storage.save();
    } catch (error) {
      if (error.code === '23505') {
        throw new ConflictException('Tài khoản đã sử dụng dịch vụ này');
      }
    }
    return storage;
  }

  async updateApprovedStorage(
    id: number,
    updateApprovedStorageDto: UpdateApprovedStorageDto
  ) {
    const { maxSize, endDate, status } = updateApprovedStorageDto;
    await this.createQueryBuilder()
      .update(Storage)
      .set({ maxSize, endDate, status })
      .where('id = :id', { id })
      .execute();

    const updated = await this.findOne({ id });
    if (!updated) {
      throw new NotFoundException('Dịch vụ lưu trữ này không tồn tại');
    }
    return updated;
  }

  async incrementStorageSize(storageId: number, size: number){
    this.increment({ id: storageId }, "currentSize", size);
  }

  async decrementStorageSize(storageId: number, size: number){
    this.decrement({ id: storageId }, "currentSize", size);
  }
}

@EntityRepository(StorageFolder)
export class StorageFolderRepository extends Repository<StorageFolder> {
  async createRootFolder(account: Account) {
    const rootFolder = new StorageFolder();
    rootFolder.folderType = FolderType.ROOT;
    rootFolder.childFiles = [];
    rootFolder.childFolders = [];
    rootFolder.account = account;
    await rootFolder.save();
  }

  async createFolder(createFolderDto: CreateFolderDto, account: Account) {
    const { name } = createFolderDto;
    const newFolder = new StorageFolder();
    newFolder.name = name;
    newFolder.folderType = FolderType.DIR;
    newFolder.account = account;
    const updated = await newFolder.save();
    return updated;
  }
  async addFileToFolder(fileId: number, folderId: number) {
    const folder = await this.findOne({ id: folderId });
    folder.childFiles.push(fileId);
    const updated = await folder.save();
    return updated;
  }

  async addFolderToFolder(parentFolderId: number, folderId: number) {
    const folder = await this.findOne({ id: parentFolderId });
    folder.childFolders.push(folderId);
    const updated = await folder.save();
    return updated;
  }

  async removeFileFromFolder(folderId: number, fileId: number) {
    const folder = await this.findOne({ id: folderId });
    folder.childFiles = folder.childFiles.filter(file => file !== fileId);
    const updated = await folder.save();
    return updated;
  }

  async deleteFolder(folderId: number, account: Account) {
    await this.createQueryBuilder()
      .delete()
      .from(StorageFolder)
      .where('id = :id', { id: folderId })
      .execute();
  }

  async removeChildFolderFromFolder(folderId: number, childFolder: number) {
    const folder = await this.findOne({ id: folderId });
    folder.childFolders = folder.childFolders.filter(
      folder => folder !== childFolder
    );
    const updated = await folder.save();
    return updated;
  }

  async updateFolder(
    updateFolderDto: UpdateFolderDto,
    folderId: number,
    childFolderId: number,
    account: Account
  ) {
    const { name } = updateFolderDto;
    const folder = await this.findOne({ id: childFolderId, account });
    folder.name = name;
    const updated = await folder.save();
    return updated;
  }
}
@EntityRepository(StorageFile)
export class StorageFileRepository extends Repository<StorageFile> {
  async saveFile(file: UploadFileDto, account: Account) {
    const newFile = new StorageFile();
    newFile.originalname = file.originalname;
    newFile.filename = file.filename;
    newFile.path = 'storages/upload/' + file.filename;
    newFile.size = file.size;
    newFile.mimetype = file.mimetype;
    newFile.uploadDate = new Date();
    newFile.account = account;
    await newFile.save();
    const savedFile = await this.findOne({ filename: newFile.filename });
    return savedFile;
  }

  async deleteFile(fileId: number, account: Account) {
    await this.createQueryBuilder()
      .delete()
      .from(StorageFile)
      .where('id = :id', { id: fileId })
      .execute();
  }

  async updateFile(
    updateFileDto: UpdateFileDto,
    fileId: number,
    account: Account
  ) {
    const { name } = updateFileDto;
    const file = await this.findOne({ id: fileId, account });
    file.originalname = name;
    const updated = await file.save();
    return updated;
  }
}
