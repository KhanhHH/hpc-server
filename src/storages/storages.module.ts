import { Module } from '@nestjs/common';
import { StoragesController } from './storages.controller';
import { StoragesService } from './storages.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import {
  StorageRepository,
  StorageFileRepository,
  StorageFolderRepository
} from './storage.repository';
import { AccountModule } from '../accounts/accounts.module';
import { MulterModule } from '@nestjs/platform-express';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      StorageRepository,
      StorageFolderRepository,
      StorageFileRepository
    ]),
    MulterModule.register({
      dest: '/upload'
    }),
    AccountModule
  ],
  controllers: [StoragesController],
  providers: [StoragesService]
})
export class StoragesModule {}
