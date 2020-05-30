import { EntityRepository, Repository } from 'typeorm';
import { Storage } from './storage.entity';
import { Account } from '../accounts/account.entity';
import { ConflictException } from '@nestjs/common';

@EntityRepository(Storage)
export class StorageRepository extends Repository<Storage> {
  async createStorage(account: Account, maxSize: number, endDate: Date) {
    const storage = new Storage();
    storage.startDate = new Date();
    storage.endDate = endDate;
    storage.maxSize = maxSize;
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
}
