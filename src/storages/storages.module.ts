import { Module } from '@nestjs/common';
import { StoragesController } from './storages.controller';
import { StoragesService } from './storages.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { StorageRepository } from './storage.repository';
import { AccountModule } from '../accounts/accounts.module';


@Module({
  imports: [
    TypeOrmModule.forFeature([StorageRepository]),
    AccountModule
  ],
  controllers: [StoragesController],
  providers: [StoragesService]
})
export class StoragesModule {}
