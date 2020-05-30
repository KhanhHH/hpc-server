import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { StorageRepository } from './storage.repository';
// import { Account } from '../accounts/account.entity';

@Injectable()
export class StoragesService {
  constructor(
    @InjectRepository(StorageRepository)
    private storageRepository: StorageRepository
  ) {}
//   async createStorage(account: Account, maxSize: number, endDate: Date) {
//      const createdStorage = await this.storageRepository.createStorage(account, maxSize, endDate);
//     return createdStorage;
//   }
}
