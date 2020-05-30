import { EntityRepository, Repository } from 'typeorm';
import { Storage } from './storage.entity';
import { Account } from '../accounts/account.entity';
import { ConflictException } from '@nestjs/common';
import { FeatureStatus } from '../features/feature.enum';
import { UpdateApprovedStorageDto } from '../features/dto';

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

    const updated = this.findOne({ id });
    return updated;
  }
}
