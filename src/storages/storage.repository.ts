import { EntityRepository, Repository } from 'typeorm';
import { Storage } from './storage.entity';
import { Account } from '../accounts/account.entity';
import { ConflictException, NotFoundException } from '@nestjs/common';
import { FeatureStatus } from '../features/feature.enum';
import { UpdateApprovedStorageDto } from '../features/dto';
import { StorageFolder } from './storage-folder.entity';
import { FolderType } from './storage-folder.enum';
import { StorageFile } from './storage-file.entity';
import { UploadFileDto } from './dto/upload-file.dto';
import { fips } from 'crypto';

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
}

@EntityRepository(StorageFolder)
export class StorageFolderRepository extends Repository<StorageFolder> {
  async findFolderById(folderId){
    
  }
  async createRootFolder(account: Account) {
    const rootFolder = new StorageFolder();
    rootFolder.folderType = FolderType.ROOT;
    rootFolder.childFiles = [];
    rootFolder.childFolder = [];
    rootFolder.account = account;
    await rootFolder.save();
  }
  async addFileToFolder(fileId:number, folderId:number){
    const folder = await this.findOne({id: folderId});
    folder.childFiles.push(fileId);
    await folder.save();
    const updated = await this.findOne({id: folderId});
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
    const savedFile = await this.findOne({filename: newFile.filename});
    return savedFile;
  }
}
