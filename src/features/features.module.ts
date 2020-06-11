import { Module } from '@nestjs/common';
import { FeaturesService } from './features.service';
import { FeaturesController } from './features.controller';
import { AccountModule } from '../accounts/accounts.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { FeatureRequestRepository } from './feature.repository';
import { StoragesModule } from '../storages/storages.module';
import {
  StorageRepository,
  StorageFolderRepository
} from '../storages/storage.repository';
import { ComputingRepository } from '../computings/computing.repository';
import { ComputingsModule } from '../computings/computings.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      FeatureRequestRepository,
      StorageRepository,
      StorageFolderRepository,
      ComputingRepository
    ]),
    AccountModule,
    StoragesModule,
    ComputingsModule
  ],
  providers: [FeaturesService],
  controllers: [FeaturesController]
})
export class FeaturesModule {}
